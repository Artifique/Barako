"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!rounded-xl !border !border-slate-200 !text-sm !shadow-lg",
          style: {
            background: "#ffffff",
            color: "var(--text-main)"
          }
        }}
      />
    </>
  );
}
