import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Disaster Relief Nepal",
  description: "Coordination platform for disaster response in Nepal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 pb-20">
        {/* Main content area — bottom padding reserves space for nav */}
        <main>{children}</main>

        {/* Bottom navigation — always visible on public pages */}
        <BottomNav />
      </body>
    </html>
  );
}
