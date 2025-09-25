import CreateWorkSpaceForm from "@/components/workspace/createWorkspace/createWorkspaceForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Manage your document and start training model",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Your Workspace" />
      <CreateWorkSpaceForm />
    </div>
  );
}




