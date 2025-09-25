"use client"

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface TrainingWorkspace {
  workspace_id: string;
  workspace_name: string;
  workspace_type: string;
  file_count: number;
  capacity: number;
  workspace_context: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

const ListTrainingWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<TrainingWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  // Loại bỏ router
  // const router = useRouter(); 
  const pathname = usePathname();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/workspace`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        
        if (response.ok) {
        const data = await response.json();
        
        // Kiểm tra nếu data không phải là mảng, hãy đặt nó vào một mảng
        if (!Array.isArray(data)) {
            setWorkspaces([data]); 
        } else {
            setWorkspaces(data);
        }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        setLoading(false);
    }
    };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90">Training Workspaces</h1>
          <button
            onClick={() => handleNavigation('/dashboard/workspace/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Create New Workspace
          </button>
        </div>

        <div className="grid gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.workspace_id}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 dark:border-gray-800 p-6 hover:shadow-md transition duration-200 ${
                workspace.status === 'active' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                      {workspace.workspace_name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-gray-400">
                      {workspace.workspace_type}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{workspace.workspace_context}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Documents:</span>
                      {workspace.file_count}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Capacity:</span>
                      {workspace.capacity}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Created:</span>
                      {formatDate(workspace.created_at)}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Updated:</span>
                      {formatDate(workspace.updated_at)}
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex flex-col items-end space-y-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    workspace.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {workspace.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleNavigation(`/dashboard/workspace/${workspace.workspace_id}`)}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleNavigation(`/dashboard/workspace/${workspace.workspace_id}`)}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {workspaces.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">No workspaces found</div>
              <button
                onClick={() => handleNavigation('/dashboard/workspace/create')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create your first workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListTrainingWorkspace;