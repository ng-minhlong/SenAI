import React from "react";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="loader" />
    </div>
  );
}
