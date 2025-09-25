"use client"

import {
  ChevronDownIcon,
} from "../../../icons/index";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation'; // import usePathname

export default function CreateWorkSpaceForm() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [workspaceContext, setWorkspaceContext] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();

  const isSaveDisabled = !workspaceName || !workspaceType;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const requestBody = {
        workspace_name: workspaceName,
        workspace_type: workspaceType,
        workspace_context: workspaceContext,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/workspace/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect đến URL mới
        window.location.href = `/dashboard/workspace/${data.workspace_id}`;
      } else {
        const errorData = await response.json();
        console.error('Failed to create workspace:', errorData.message);
        alert(`Failed to create workspace: ${errorData.message}`);
      }

    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };
  
  return (
    <form className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6" onSubmit={handleSave}>
      <div className="space-y-12">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white/90">Workspace detail</h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            This information will be displayed publicly so be careful what you share.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="workspace_name" className="block text-sm/6 font-medium text-gray-900 dark:text-white/90">
                Workspace Name (*)
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <input
                    id="workspace_name"
                    name="workspace_name"
                    type="text"
                    placeholder="First Workspace"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="workspace_context" className="block text-sm/6 font-medium text-gray-900 dark:text-white/90">
                Workspace Context / Workspace Description
              </label>
              <div className="mt-2">
                <textarea
                  id="workspace_context"
                  name="workspace_context"
                  rows={3}
                  value={workspaceContext}
                  onChange={(e) => setWorkspaceContext(e.target.value)}
                  className="block w-full rounded-md bg-white/5 dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white/90 outline-1 -outline-offset-1 outline-gray-200 dark:outline-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-400">Write a few sentences about this workspace.</p>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="workspace_type" className="block text-sm/6 font-medium text-gray-900 dark:text-white/90">
                Workspace Type (*)
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="workspace_type"
                  name="workspace_type"
                  value={workspaceType}
                  onChange={(e) => setWorkspaceType(e.target.value)}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 dark:bg-gray-800 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white/90 outline-1 -outline-offset-1 outline-gray-200 dark:outline-gray-800 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                >
                  <option value=""></option>
                  <option value="document">Document Rag</option>
                  <option value="image">Image - Computer Vision</option>
                  <option value="recording">Recording</option>
                  <option value="mix">Mix</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 dark:text-gray-400 sm:size-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
       
        <button
          type="submit"
          disabled={isSaveDisabled || isSaving}
          className={`rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            isSaveDisabled || isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-400'
          }`}
        >
          {isSaving ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  )
}