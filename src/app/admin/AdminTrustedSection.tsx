"use client";

import React, { useState } from "react";
import AdminTrustedForm from "./AdminTrustedForm";
import AdminTrustedList from "./AdminTrustedList";

export default function AdminTrustedSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <AdminTrustedForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <AdminTrustedList refreshKey={refreshKey} />
    </>
  );
}
