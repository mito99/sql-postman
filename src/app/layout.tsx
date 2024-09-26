import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sql-postman",
  description: "sql-postman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
