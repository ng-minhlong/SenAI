import ListTrainingWorkspace from "@/components/workspace/AllWorkSpace";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "WorkSpaces",
  description:
    "List WorkSpace for you to train your own bot, model,...",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Workspace" />
      <ListTrainingWorkspace />
    </div>
  );
}
