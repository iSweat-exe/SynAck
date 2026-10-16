import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

// The only font of the interface (DESIGN.md §2): the four real Space Mono variants, self-hosted by
// next/font at build time (no request to Google when a page is visited).
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SynAck",
  description:
    "Apprenez la programmation et les protocoles réseau, gratuitement, directement dans votre navigateur.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${spaceMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
