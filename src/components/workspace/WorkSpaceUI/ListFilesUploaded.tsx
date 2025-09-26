"use client"

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useParams } from "next/navigation"; 


export interface TrainingWorkspace {
  file_id: string;
  workspace_id: string;
  file_name: string;
  file_link: string;
  file_size: number;
  file_type: string;
  file_format: string;
  file_category: string;
  uploaded_at: string;
  status: 'active' | 'processing';
}

interface ListFilesUploadedProps {
    filesUploaded: TrainingWorkspace[];
    setFilesUploaded: React.Dispatch<React.SetStateAction<TrainingWorkspace[]>>;
    loading: boolean;
}

const ListFilesUploaded: React.FC<ListFilesUploadedProps> = ({ filesUploaded, setFilesUploaded, loading }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Hàm điều hướng mới
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <h3> Files Uploaded </h3>
        <div className="max-w-7xl mx-auto">
            

            <div className="grid gap-6">
            {filesUploaded.map((file) => (
                <div
                key={file.file_id}
                className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 dark:border-gray-800 p-6 hover:shadow-md transition duration-200 ${
                    file.status === 'active' ? 'border-green-500' : 'border-red-500'
                }`}
                >
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                        {file.file_name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-gray-400">
                        {file.file_category}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{file.file_name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                        <span className="font-medium mr-2">File Link:</span>
                        {file.file_link}
                        </div>
                        <div className="flex items-center">
                        <span className="font-medium mr-2">File Size:</span>
                        {file.file_size}
                        </div>
                        <div className="flex items-center">
                        <span className="font-medium mr-2">Created:</span>
                        {formatDate(file.uploaded_at)}
                        </div>
                        <div className="flex items-center">
                        <span className="font-medium mr-2">File Format:</span>
                        {(file.file_format)}
                        </div>
                    </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end space-y-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        file.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                        {file.status}
                    </span>
                    <button
                        onClick={() => handleNavigation(`/dashboard/file/${file.file_id}`)}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        View
                    </button>

                     <button
                        onClick={() => handleNavigation(`/dashboard/file/${file.file_id}`)}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Proceed this file
                    </button>


                    <button
                        onClick={async () => {
                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/file/delete/${file.file_id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ workspace_id: file.workspace_id })
                            });
                            if (res.ok) {
                            setFilesUploaded(filesUploaded.filter(f => f.file_id !== file.file_id));
                            } else {
                            alert('Delete failed');
                            }
                        } catch (err) {
                            alert('Delete error');
                        }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-red-700 dark:text-gray-200 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        Delete
                    </button>
                    </div>
                </div>
                </div>
            ))}

            {filesUploaded.length === 0 && (
                <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg">No file found</div>
                <p>Upload your first file and start training</p>
                    
                </div>
            )}
            </div>
      </div>
    </div>
  );
};

export default ListFilesUploaded;