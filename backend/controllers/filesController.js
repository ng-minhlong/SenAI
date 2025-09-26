import db from '../db.js';
import axios from "axios";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";


export const getAllFiles = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM user_files');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getFileByID = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT workspace_id, workspace_name, workspace_type, file_count, capacity, workspace_context, status, created_at, updated_at
       FROM user_files 
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows); // trả về mảng
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getFilesByWorkspaceID = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy workspaceID từ req.params thay vì res.workspace_id
    const workspaceID = req.params.workspaceID; 

    // Kiểm tra xem workspaceID có tồn tại không
    if (!workspaceID) {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const [rows] = await db.execute(
      `SELECT file_id, workspace_id, user_id, file_name, file_link, file_size, file_type, file_format, file_category, uploaded_at, status
       FROM user_files 
       WHERE user_id = ? AND workspace_id = ? `,
      [userId, workspaceID]
    );

    if (rows.length === 0) {
      // Trả về 404 nếu không tìm thấy file cho user đó
      return res.status(404).json({ message: 'File not found for this user' });
    }

    // Trả về đối tượng workspace duy nhất thay vì mảng
    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const uploadFile = async (req, res) => {
  const userId = req.user.id;
  const { workspace_id, file_name, file_category } = req.body;
  const file = req.file; // multer upload.single("file")

  if (!file) {
    return res.status(400).json({ message: "No file provided web backend" });
  }

  // Danh sách loại file hợp lệ
  const allowedExtensions = [
    ".pdf", ".xlsx", ".doc", ".docx", ".pptx", ".txt", ".mp3", ".mp4", ".wav"
  ];
  const ext = file.originalname.substring(file.originalname.lastIndexOf(".")).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ message: `File type not allowed: ${ext}` });
  }

  // Xác định file_type + file_format từ mimetype
  const mime = file.mimetype;
  let file_type, file_format;

  if (mime.startsWith("image/")) file_type = "image";
  else if (mime.startsWith("video/")) file_type = "video";
  else if (mime.startsWith("audio/")) file_type = "recording";
  else file_type = "document";

  file_format = mime.split("/")[1];
  const now = new Date();

  try {
    // Gọi sang MinIO
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    formData.append("userID", userId);
    formData.append("category", file_type);

    const minioRes = await axios.post(
      `${process.env.STORAGE_ROUTE}/upload`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Lấy data từ MinIO trả về
    const { fileId, objectName, size, mimetype } = minioRes.data;

    // Insert vào DB với fileId từ MinIO
    const sql = `
      INSERT INTO user_files 
      (user_id, status, isParsed, isEmbedded, isActivate, file_id, workspace_id, file_name, file_link, file_size, file_type, file_format, file_category, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      "uploaded", 
      "0",
      "0",
      "0",
      fileId,   
      workspace_id,
      file_name || file.originalname,
      objectName,
      size,
      file_type,
      file_format,
      file_category || file_type, 
      now,
    ];

    await db.query(sql, values);

    res.status(201).json({
      message: "File created successfully",
      workspace_id,
      file_name: file.originalname,
      file_size: size,
      file_format: file_format,
      file_type: file_type,
      file_id: fileId,
      status: "active",
      file_link: objectName,
      uploaded_at: now,
    });
  } catch (error) {
    console.error("Error creating file record:", error);
    res.status(500).json({ message: "Failed to create file record" });
  }
};

export const deleteFileByID = async (req, res) => {
  const userId = req.user.id;
  const fileID = req.params.fileID;

  try {
    // 1. Kiểm tra file trong DB
    const [rows] = await db.query(
      "SELECT * FROM user_files WHERE user_id = ? AND file_id = ?",
      [userId, fileID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // 2. Xóa record trong DB
    await db.query(
      "DELETE FROM user_files WHERE user_id = ? AND file_id = ?",
      [userId, fileID]
    );

    // 3. Gọi API MinIO để xóa file
    await axios.delete(`${process.env.STORAGE_ROUTE}/file/${fileID}`);

    // 4. Trả response
    res.status(200).json({
      message: "File deleted successfully",
      file_id: fileID,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

export const editFile = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    phone_number,
    dob,
  } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id FROM user_files WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.execute(
      `UPDATE user_files SET 
        firstName = ?,
        lastName = ?,
        phone_number = ?,       
        dob = ?
      WHERE user_id = ?`,
      [firstName, lastName, phone_number, dob, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
