import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFTer - Transform Your Photos into Anime Characters",
  description: "Transform your photos into unique anime-style characters using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-blue-600">NFTer</h1>
                </div>
              </div>
            </header>
            <main>{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
