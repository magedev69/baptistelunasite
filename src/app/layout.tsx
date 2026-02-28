import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B+L",
  description: "Our love forever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}