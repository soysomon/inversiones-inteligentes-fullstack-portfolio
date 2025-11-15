import React from "react";
import "./globals.css";
import ClientBody from "./ClientBody";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="antialiased">
      <ClientBody>{children}</ClientBody>
      {/* Script se puede cargar directamente en index.html o usar useEffect */}
    </div>
  );
}