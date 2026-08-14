import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Companion Atlas — Understand. Care. Grow Together.",
  description: "Breed knowledge, food safety, training, behaviour and personalised pet care in one trusted companion.",
  openGraph: {
    title: "Companion Atlas — Understand your pet better",
    description: "The warm, trusted companion for smarter everyday pet care.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
