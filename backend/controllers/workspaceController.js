import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';


export const getAllWorkspaces = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM user_workspace');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT workspace_id, workspace_name, workspace_type, file_count, capacity, workspace_context, status, created_at, updated_at
       FROM user_workspace 
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


export const getWorkspaceByID = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy workspaceID từ req.params thay vì res.workspace_id
    const workspaceID = req.params.workspaceID; 

    // Kiểm tra xem workspaceID có tồn tại không
    if (!workspaceID) {
      return res.status(400).json({ message: 'Workspace ID is required' });
    }

    const [rows] = await db.execute(
      `SELECT workspace_id, workspace_name, workspace_type, file_count, capacity, workspace_context, status, created_at, updated_at
       FROM user_workspace 
       WHERE user_id = ? AND workspace_id = ?`,
      [userId, workspaceID]
    );

    if (rows.length === 0) {
      // Trả về 404 nếu không tìm thấy workspace cho user đó
      return res.status(404).json({ message: 'Workspace not found for this user' });
    }

    // Trả về đối tượng workspace duy nhất thay vì mảng
    res.json(rows[0]); 

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const createWorkspace = async (req, res) => {
  const userId = req.user.id;
  const {
    workspace_name,
    workspace_type,
    workspace_context,
  } = req.body;

  // Tạo workspace_id mới bằng UUID
  const workspace_id = uuidv4(); 
  const now = new Date();

  try {
    // Thay đổi câu lệnh SQL để khớp với thứ tự các giá trị
    const sql = `
      INSERT INTO user_workspace (user_id, status, file_count, capacity, workspace_id, workspace_name, workspace_type, workspace_context, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Sắp xếp lại mảng giá trị để khớp với thứ tự trong câu lệnh SQL
    const values = [
      userId,
      'active',
      0,
      0,
      workspace_id, // Sử dụng workspace_id được tạo mới
      workspace_name,
      workspace_type,
      workspace_context,
      now,
      now
    ];

    await db.query(sql, values);

    // Gửi phản hồi thành công, bao gồm cả workspace_id vừa tạo
    res.status(201).json({ 
      message: 'Workspace record created successfully', 
      workspace_id: workspace_id 
    });

  } catch (error) {
    console.error('Error creating workspace record:', error);
    res.status(500).json({ message: 'Failed to create workspace record' });
  }
};


export const editWorkspace = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    phone_number,
    dob,
  } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id FROM user_workspace WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update user_workspace
    await db.execute(
      `UPDATE user_workspace SET 
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
