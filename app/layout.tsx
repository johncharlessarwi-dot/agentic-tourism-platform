import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafariOS | Agentic Tourism Platform",
  description: "AI-powered operations, marketing and guest experience for East African tourism businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
