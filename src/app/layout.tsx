import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RailCache — Know Before The Gates Close",
    template: "%s | RailCache",
  },
  description:
    "Predict railway crossing closures before they happen. Get there faster, without the wait.",
  keywords: ["railway crossing", "route planning", "Mumbai", "traffic prediction"],
  openGraph: {
    title: "RailCache — Know Before The Gates Close",
    description: "Predict railway crossing disruptions and get smarter routes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-paper text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
