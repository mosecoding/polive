import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Footer from "@/components/layouts/footer";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layouts/header";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "polive",
  description: "Build polls, share them, and see the results in real time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistMono.variable} font-geist-mono antialiased dark`}
        >
          <ConvexClientProvider>
            <div className="flex flex-col min-h-dvh">
              <Header />
              <main className="relative flex-1 mt-20">
                <div className="max-w-7xl mx-auto py-10 px-5">{children}</div>
              </main>
              <Footer />
            </div>
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
