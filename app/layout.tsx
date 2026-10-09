import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Vercel Projects Hub",
  description: "Live showcase and directory of all projects deployed on Vercel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07080c] text-neutral-100 antialiased selection:bg-blue-600 selection:text-white">
        {/* Subtle background gradient glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl opacity-70" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[300px] bg-purple-600/10 blur-3xl opacity-50" />
        </div>
        {children}
      </body>
    </html>
  );
}
