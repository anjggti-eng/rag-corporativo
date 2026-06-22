import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAG Corporativo",
  description: "Sistema RAG com recuperação híbrida e avaliação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f5f5f7]">{children}</body>
    </html>
  );
}
