import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/frontend/theme-context";
import { BottomNav } from "@/frontend/BottomNav";

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
        <ThemeProvider>
          <main>{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
