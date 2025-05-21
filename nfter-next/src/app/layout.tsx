import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import { WalletConnect } from "@/components/WalletConnect";

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
                  {/* Section for Logo (top-left within this content block) */}
                  <div className="self-start"> {/* Ensures this block is at the start if parent is flex/grid; otherwise, it's a standard block */}
                    <Link href="/">
                      <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors w-max">
                        NFTer
                      </h1>
                    </Link>
                  </div>
                  <WalletConnect />
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
