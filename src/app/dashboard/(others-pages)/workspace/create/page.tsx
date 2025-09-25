import CreateWorkSpaceForm from "@/components/workspace/createWorkspace/createWorkspaceForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create New WorkSpace",
  description:
    "Create a new workspace",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create a new WorkSpace" />
      <CreateWorkSpaceForm />
    </div>
  );
}




