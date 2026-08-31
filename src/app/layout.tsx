import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { FontProvider } from "@/lib/font-context";
import { AppShell } from "@/components/AppShell";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <ThemeProvider>
          <FontProvider>
            <AppShell>{children}</AppShell>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
