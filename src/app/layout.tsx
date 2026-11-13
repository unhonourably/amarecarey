import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { AudioPreload } from "@/components/audio/AudioPreload";
import { BackgroundMusic } from "@/components/audio/BackgroundMusic";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const audioSrc = siteConfig.audio.src;

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <AudioPreload />
      </head>
      <body className="safe-x safe-b">
        <Script id="bgm-early" strategy="beforeInteractive">
          {`(function(){try{var a=new Audio(${JSON.stringify(audioSrc)});a.preload="auto";a.loop=true;a.load();window.__BGM_EARLY__=a;}catch(e){}})();`}
        </Script>
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
