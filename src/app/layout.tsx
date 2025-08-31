import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marco Basta - Artist and Teacher",
  description: "Portfolio of Marco Basta, Artist and Teacher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
