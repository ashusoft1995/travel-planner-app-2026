"use client";

import { Toaster } from "react-hot-toast";

export default function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "1rem",
          padding: "12px 16px",
        },
        className: "dark:!bg-slate-800 dark:!text-slate-100",
      }}
    />
  );
}
