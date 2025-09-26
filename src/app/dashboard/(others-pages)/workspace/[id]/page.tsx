"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileUploadArea from "@/components/workspace/WorkSpaceUI/FileUploadArea";
import WorkSpaceDetail from "@/components/workspace/WorkSpaceUI/WorkSpaceDetail";
import ListFileUploaded from "@/components/workspace/WorkSpaceUI/ListFilesUploaded";
import React, { useState, useEffect } from "react";
import type { TrainingWorkspace } from "@/components/workspace/WorkSpaceUI/ListFilesUploaded";
import { useParams } from "next/navigation";



export default function MyWorkSpace() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filesUploaded, setFilesUploaded] = useState<TrainingWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const workspaceID = params?.id;

  // Fetch files on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/file/workspaceID/${workspaceID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (!Array.isArray(data)) {
            setFilesUploaded([data]);
          } else {
            setFilesUploaded(data);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, [workspaceID]);

  // Hàm thêm file mới sau khi upload thành công
  const handleAddFile = (newFile: TrainingWorkspace) => {
    setFilesUploaded(prev => [newFile, ...prev]);
  };

  const tabs = [
    { id: "overview", label: "My Overview", content: <WorkSpaceDetail /> },
    { id: "file_processing", label: "File processing", content: (
      <div>
        <h1>Step 1: Edit and Create your files</h1>
  <ListFileUploaded filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} loading={loading} />
  <FileUploadArea onFileUploaded={handleAddFile} workspaceId={workspaceID} />

        <h1>Step 2: Proccessing (Parse) With your document</h1>
      </div>
    ) },
    { id: "playground", label: "Playground", content: <p>hello 3</p> },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="My Workspace" />
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? "text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500"
                    : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${
              activeTab === tab.id ? "block" : "hidden"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}