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
  const audioTracks = siteConfig.audio.tracks;

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <AudioPreload />
      </head>
      <body className="safe-x safe-b">
        <Script id="bgm-early" strategy="beforeInteractive">
          {`(function(){try{var tracks=${JSON.stringify(audioTracks)};if(!tracks.length)return;try{sessionStorage.removeItem("bgm-track");}catch(e){}function pickI(n){if(n<=1)return 0;if(window.crypto&&crypto.getRandomValues){var lim=256-(256%n),b=new Uint8Array(1);do{crypto.getRandomValues(b);}while(b[0]>=lim);return b[0]%n;}return Math.floor(Math.random()*n);}var picked=tracks[pickI(tracks.length)];window.__BGM_SRC__=picked;var a=new Audio(picked);a.preload="auto";a.loop=false;a.load();window.__BGM_EARLY__=a;}catch(e){}})();`}
        </Script>
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
