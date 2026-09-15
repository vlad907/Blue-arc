"use client";

import React, { useState } from "react";
import AdminUploadForm from "./AdminUploadForm";
import AdminProjectsManager from "./AdminProjectsManager";

export default function AdminProjectsSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <AdminUploadForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <AdminProjectsManager refreshKey={refreshKey} />
    </>
  );
}
