import { siteConfig } from "@/config/site";

export function AudioPreload() {
  return (
    <link
      rel="preload"
      href={siteConfig.audio.src}
      as="fetch"
      type="audio/mpeg"
      crossOrigin="anonymous"
      fetchPriority="high"
    />
  );
}
