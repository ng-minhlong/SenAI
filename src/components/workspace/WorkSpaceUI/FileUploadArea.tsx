"use client";

import React, { useState, useCallback } from "react";
import Modal from "@/components/common/Modal";
import { useParams } from "next/navigation";


interface FileUploadAreaProps {
    onFileUploaded: (file: any) => void;
    workspaceId: any;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileUploaded, workspaceId }) => {
    const acceptedFileTypes = {
        document: [".pdf", ".xlsx", ".doc", ".docx", ".pptx", ".txt"],
        media: [".mp3", ".mp4", ".wav"],
    };
    const inputAccept = [
        ...acceptedFileTypes.document,
        ...acceptedFileTypes.media,
    ].join(",");

    const [files, setFiles] = useState<any[]>([]);
    const [previewFile, setPreviewFile] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadReport, setUploadReport] = useState<string>("");
    const [isDragOver, setIsDragOver] = useState(false);
    // const params = useParams(); 
    // workspaceId lấy từ props

    // Xử lý drag over - MỚI THÊM
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    // Xử lý drag leave - MỚI THÊM
    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    // Xử lý drop - MỚI THÊM
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file => {
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            return inputAccept.includes(fileExtension);
        });

        if (validFiles.length > 0) {
            const newFiles = validFiles.map((file) => ({
                file,
                file_name: "",
                file_category: "document",
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    }, [inputAccept]);

    // Xử lý chọn nhiều file - ĐÃ CẬP NHẬT
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        processSelectedFiles(selectedFiles);
    };

    // Hàm xử lý files được chọn - MỚI THÊM
    const processSelectedFiles = (selectedFiles: File[]) => {
        const newFiles = selectedFiles.map((file) => ({
            file,
            file_name: file.name.split('.')[0], // Auto-fill tên file
            file_category: acceptedFileTypes.document.includes('.' + file.name.split('.').pop()?.toLowerCase()) 
                ? "document" 
                : "media",
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    // Xử lý nhập tên/category
    const handleInputChange = (idx: number, key: string, value: string) => {
        const updated = [...files];
        updated[idx][key] = value;
        setFiles(updated);
    };

    // Xem trước file
    const handlePreview = (fileObj: any) => {
        setPreviewFile(fileObj.file);
        setShowModal(true);
    };

    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
        setPreviewFile(null);
    };

    // Xóa file khỏi danh sách upload
    const handleRemoveFile = (idx: number) => {
        const updated = [...files];
        updated.splice(idx, 1);
        setFiles(updated);
    };

    // Xóa tất cả files - MỚI THÊM
    const handleClearAll = () => {
        setFiles([]);
    };

    // Upload tất cả file
    const handleUploadAll = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setUploadReport("");
        let success = 0, fail = 0;
        for (const fileObj of files) {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const formData = new FormData();
                formData.append("file", fileObj.file);
                formData.append("file_name", fileObj.file_name || fileObj.file.name);
                formData.append("file_category", fileObj.file_category);
                formData.append("workspace_id", Array.isArray(workspaceId) ? workspaceId[0] : (workspaceId || ""));
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/file/upload`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });
                if (response.ok) {
                    const newFile = await response.json();
                    onFileUploaded(newFile);
                    success++;
                } else {
                    fail++;
                }
            } catch (err) {
                fail++;
                console.error('Upload error:', err);
            }
        }
        setUploadReport(`Upload thành công: ${success}, thất bại: ${fail}`);
        setUploading(false);
        if (success > 0) {
            setFiles([]);
        }
    };

    // Hàm render preview cho document
    const renderDocumentPreview = (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const fileUrl = URL.createObjectURL(file);

        switch (fileExtension) {
            case 'pdf':
                return (
                    <iframe 
                        src={fileUrl} 
                        className="w-full h-96 border rounded"
                        title="PDF Preview"
                    />
                );
            
            case 'txt':
                return (
                    <div className="w-full h-96 border rounded bg-white p-4 overflow-auto">
                        <TxtPreview file={file} />
                    </div>
                );
            
            case 'xlsx':
            case 'xls':
                return (
                    <div className="w-full max-w-4xl mx-auto p-4 bg-white border rounded">
                        <div className="text-center py-8">
                            <div className="text-green-500 text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Excel File Preview</h3>
                            <p className="text-gray-600 mb-4">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                Để xem nội dung file Excel, vui lòng tải file về hoặc mở bằng Microsoft Excel.
                            </p>
                            <a 
                                href={fileUrl} 
                                download={file.name}
                                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Download File
                            </a>
                        </div>
                    </div>
                );
            
            case 'doc':
            case 'docx':
                return (
                    <div className="w-full max-w-4xl mx-auto p-4 bg-white border rounded">
                        <div className="text-center py-8">
                            <div className="text-blue-500 text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-2">Word Document Preview</h3>
                            <p className="text-gray-600 mb-4">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                Để xem nội dung file Word, vui lòng tải file về hoặc mở bằng Microsoft Word.
                            </p>
                            <a 
                                href={fileUrl} 
                                download={file.name}
                                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Download File
                            </a>
                        </div>
                    </div>
                );
            
            case 'pptx':
            case 'ppt':
                return (
                    <div className="w-full max-w-4xl mx-auto p-4 bg-white border rounded">
                        <div className="text-center py-8">
                            <div className="text-orange-500 text-6xl mb-4">📽️</div>
                            <h3 className="text-xl font-semibold mb-2">PowerPoint Preview</h3>
                            <p className="text-gray-600 mb-4">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                Để xem nội dung file PowerPoint, vui lòng tải file về hoặc mở bằng Microsoft PowerPoint.
                            </p>
                            <a 
                                href={fileUrl} 
                                download={file.name}
                                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Download File
                            </a>
                        </div>
                    </div>
                );
            
            default:
                return (
                    <div className="text-center py-8">
                        <div className="text-gray-500 text-6xl mb-4">📄</div>
                        <p className="text-gray-700">Không hỗ trợ preview cho loại file này</p>
                        <a 
                            href={fileUrl} 
                            download={file.name}
                            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Download File
                        </a>
                    </div>
                );
        }
    };

    // Component để preview file txt
    const TxtPreview = ({ file }: { file: File }) => {
        const [content, setContent] = useState<string>('');
        const [loading, setLoading] = useState(true);

        React.useEffect(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setContent(e.target?.result as string);
                setLoading(false);
            };
            reader.onerror = () => {
                setContent('Lỗi khi đọc file');
                setLoading(false);
            };
            reader.readAsText(file);
        }, [file]);

        if (loading) {
            return <div className="text-center py-4">Đang tải nội dung...</div>;
        }

        return (
            <pre className="whitespace-pre-wrap font-mono text-sm max-h-96 overflow-auto">
                {content}
            </pre>
        );
    };

    return (
        <div>
            <div className="w-full p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow-md border border-yellow-200 dark:border-gray-600">
                <p className="text-base font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Chọn file để upload</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">We accept these files:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Document: {acceptedFileTypes.document.join(", ")}</li>
                    <li>Media: {acceptedFileTypes.media.join(", ")}</li>
                </ul>
            </div>

            {/* Dropzone Area - ĐÃ CẬP NHẬT VỚI DRAG & DROP */}
            <div className="flex items-center justify-center w-full mt-4">
                <input
                    id="dropzone-file"
                    type="file"
                    multiple
                    accept={inputAccept}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label 
                    htmlFor="dropzone-file"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        isDragOver 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                            : "border-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className={`w-8 h-8 mb-4 transition-colors duration-200 ${
                            isDragOver ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                        }`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className={`mb-2 text-sm transition-colors duration-200 ${
                            isDragOver ? "text-blue-600 font-bold" : "text-gray-500 dark:text-gray-400"
                        }`}>
                            <span className="font-semibold">
                                {isDragOver ? "Thả file để upload" : "Click to upload"}
                            </span> or drag and drop
                        </p>
                        <p className={`text-xs transition-colors duration-200 ${
                            isDragOver ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                        }`}>
                            {isDragOver ? "Thả file tại đây..." : "SVG, PNG, JPG, PDF, DOC, XLSX, PPTX hoặc MP3, MP4"}
                        </p>
                        {isDragOver && (
                            <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                Thả file để upload
                            </div>
                        )}
                    </div>
                </label>
            </div>

            {/* Thông báo số lượng file - MỚI THÊM */}
            {files.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                            Đã chọn {files.length} file(s)
                        </span>
                        <button 
                            onClick={handleClearAll}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* Danh sách file đã chọn - ĐÃ CẬP NHẬT */}
            {files.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-lg">Files to upload:</h4>
                    <div className="space-y-3">
                        {files.map((fileObj, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                                <div className="flex items-center space-x-3 flex-1">
                                    <span className="font-medium text-sm truncate" title={fileObj.file.name}>
                                        {fileObj.file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                                    <input
                                        type="text"
                                        placeholder="File name"
                                        value={fileObj.file_name}
                                        onChange={e => handleInputChange(idx, "file_name", e.target.value)}
                                        className="border px-2 py-1 rounded text-sm flex-1"
                                    />
                                    <select
                                        value={fileObj.file_category}
                                        onChange={e => handleInputChange(idx, "file_category", e.target.value)}
                                        className="border px-2 py-1 rounded text-sm"
                                    >
                                        <option value="document">Document</option>
                                        <option value="media">Media</option>
                                    </select>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handlePreview(fileObj)} 
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Preview
                                    </button>
                                    <button 
                                        onClick={() => handleRemoveFile(idx)} 
                                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleUploadAll}
                            disabled={uploading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : `Upload all files (${files.length})`}
                        </button>
                        
                        <button
                            onClick={handleClearAll}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                    
                    {uploadReport && (
                        <div className={`mt-3 p-3 rounded-lg ${
                            uploadReport.includes("thất bại: 0") 
                                ? "bg-green-100 text-green-700 border border-green-200" 
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}>
                            {uploadReport}
                        </div>
                    )}
                </div>
            )}

            {/* Modal preview file */}
            {showModal && previewFile && (
                <Modal onClose={closeModal}>
                    <div className="p-4 max-w-4xl max-h-screen overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg">File Preview: {previewFile.name}</h4>
                            <button 
                                onClick={closeModal}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                        
                        {previewFile.type.startsWith("image/") ? (
                            <img src={URL.createObjectURL(previewFile)} alt="preview" className="max-w-full max-h-96 mx-auto" />
                        ) : previewFile.type.startsWith("video/") ? (
                            <video controls src={URL.createObjectURL(previewFile)} className="max-w-full max-h-96 mx-auto" />
                        ) : previewFile.type.startsWith("audio/") ? (
                            <div className="text-center">
                                <audio controls src={URL.createObjectURL(previewFile)} className="mx-auto" />
                            </div>
                        ) : (
                            renderDocumentPreview(previewFile)
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
export default FileUploadArea