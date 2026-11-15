import { siteConfig } from "@/config/site";

type BgmWindow = Window & {
  __BGM_SRC__?: string;
  __BGM_EARLY__?: HTMLAudioElement;
};

export function titleForTrack(track: string): string {
  const titles = siteConfig.audio.trackTitles as
    | Record<string, string>
    | undefined;
  const title = titles?.[track];
  if (title) return title;
  const slug = track.split("/").pop()?.replace(/\.mp3$/i, "") ?? "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function defaultVolumeForTrack(track: string): number {
  const overrides = siteConfig.audio.trackVolumes as
    | Record<string, number>
    | undefined;
  const override = overrides?.[track];
  if (typeof override === "number") {
    return Math.min(1, Math.max(0, override));
  }
  return siteConfig.audio.defaultVolume;
}

export function pickUniformIndex(length: number): number {
  if (length <= 0) return 0;
  if (length === 1) return 0;

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const limit = 256 - (256 % length);
    const byte = new Uint8Array(1);
    for (;;) {
      crypto.getRandomValues(byte);
      if (byte[0] < limit) return byte[0] % length;
    }
  }

  return Math.floor(Math.random() * length);
}

export function pickUniformTrack(tracks: readonly string[]): string {
  if (tracks.length === 0) return "";
  return tracks[pickUniformIndex(tracks.length)];
}

export function pickUniformTrackExcluding(
  tracks: readonly string[],
  exclude: string
): string {
  const pool = tracks.filter((track) => track !== exclude);
  if (pool.length === 0) {
    return tracks[0] ?? "";
  }
  return pickUniformTrack(pool);
}

export function setResolvedBgmTrack(track: string) {
  if (typeof window === "undefined") return;
  (window as BgmWindow).__BGM_SRC__ = track;
}

export function resolveBgmTrack(tracks: readonly string[]): string {
  if (tracks.length === 0) return "";
  if (tracks.length === 1) return tracks[0];

  if (typeof window !== "undefined") {
    const existing = (window as BgmWindow).__BGM_SRC__;
    if (existing && tracks.includes(existing)) {
      return existing;
    }
  }

  const picked = pickUniformTrack(tracks);

  if (typeof window !== "undefined") {
    (window as BgmWindow).__BGM_SRC__ = picked;
  }

  return picked;
}

export function stopEarlyBgm() {
  if (typeof window === "undefined") return;
  const early = (window as BgmWindow).__BGM_EARLY__;
  if (!early) return;
  early.pause();
  early.removeAttribute("src");
  early.load();
  delete (window as BgmWindow).__BGM_EARLY__;
}