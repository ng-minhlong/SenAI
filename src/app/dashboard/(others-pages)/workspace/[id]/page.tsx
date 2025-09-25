"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileUploadArea from "@/components/workspace/WorkSpaceUI/FileUploadArea";
import WorkSpaceDetail from "@/components/workspace/WorkSpaceUI/WorkSpaceDetail";
import React, { useState } from "react";

export default function MyWorkSpace() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "My Overview", content: <WorkSpaceDetail /> },
    { id: "file_processing", label: "File processing", content: <FileUploadArea/> },
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