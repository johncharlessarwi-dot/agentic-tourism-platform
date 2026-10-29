import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "SafariOS | Agentic Tourism Platform",
    template: "%s | SafariOS",
  },
  description: "AI-powered operations, marketing and guest experience for East African tourism businesses. Manage enquiries, plan journeys and support teams with human-approved workflows.",
  applicationName: "SafariOS",
  keywords: [
    "tourism management platform",
    "East Africa tourism technology",
    "tour operator software",
    "safari enquiry management",
    "tourism operations"
  ],
  openGraph: {
    type: "website",
    siteName: "SafariOS",
    title: "SafariOS | Agentic Tourism Platform",
    description: "A connected workspace for East African tour operators, lodges and destination teams.",
    locale: "en_TZ"
  },
  twitter: {
    card: "summary_large_image",
    title: "SafariOS | Agentic Tourism Platform",
    description: "Smarter tourism operations and guest experiences across East Africa."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
