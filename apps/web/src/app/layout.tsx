import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodePear - Pair Programming and Coding Interview",
  description: "Pair Programming and Coding Interview Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
