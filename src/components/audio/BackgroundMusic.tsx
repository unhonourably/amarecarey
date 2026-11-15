"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  defaultVolumeForTrack,
  pickUniformTrackExcluding,
  resolveBgmTrack,
  setResolvedBgmTrack,
  stopEarlyBgm,
  titleForTrack,
} from "@/lib/audio";

const STORAGE_KEY = "bgm-volume";
const tracks = siteConfig.audio.tracks;

function volumeStorageKey(track: string) {
  return `${STORAGE_KEY}:${track}`;
}

type EarlyBgmWindow = Window & {
  __BGM_EARLY__?: HTMLAudioElement;
};

function readVolumeForTrack(track: string): number {
  if (typeof window === "undefined") {
    return defaultVolumeForTrack(track);
  }
  const saved = localStorage.getItem(volumeStorageKey(track));
  if (!saved) return defaultVolumeForTrack(track);
  const parsed = Number(saved);
  if (Number.isNaN(parsed)) return defaultVolumeForTrack(track);
  return Math.min(1, Math.max(0, parsed));
}

function canStartPlayback(audio: HTMLAudioElement) {
  return audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
}

export function BackgroundMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const previousTrackRef = useRef<string | null>(null);
  const [volume, setVolume] = useState(siteConfig.audio.defaultVolume);
  const [trackSrc, setTrackSrc] = useState<string | null>(null);
  const adminRoute = pathname.startsWith("/canes");

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || adminRoute || !trackSrc) return;
    if (!canStartPlayback(audio)) return;
    void audio.play().then(() => {
      unlockedRef.current = true;
      stopEarlyBgm();
    });
  }, [adminRoute, trackSrc]);

  const onTrackEnded = useCallback(() => {
    if (adminRoute || !trackSrc || tracks.length <= 1) return;
    const next = pickUniformTrackExcluding(tracks, trackSrc);
    if (!next) return;
    setResolvedBgmTrack(next);
    setVolume(readVolumeForTrack(next));
    setTrackSrc(next);
  }, [adminRoute, trackSrc]);

  useLayoutEffect(() => {
    const src = resolveBgmTrack(tracks);
    setTrackSrc(src);
    setVolume(readVolumeForTrack(src));
  }, []);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackSrc) return;
    audio.loop = false;
    audio.volume = volume;

    const prev = previousTrackRef.current;
    previousTrackRef.current = trackSrc;

    if (prev === null) {
      const early = (window as EarlyBgmWindow).__BGM_EARLY__;
      if (early && early.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const earlyPath = early.currentSrc
          ? new URL(early.currentSrc, window.location.origin).pathname
          : "";
        if (earlyPath === trackSrc || earlyPath.endsWith(trackSrc)) {
          if (early.currentTime > 0) {
            audio.currentTime = early.currentTime;
          }
        }
      }
      tryPlay();
      return;
    }

    if (prev !== trackSrc) {
      audio.currentTime = 0;
      tryPlay();
    }
  }, [tryPlay, trackSrc, volume]);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || previousTrackRef.current === null) return;
    audio.volume = volume;
  }, [volume]);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || adminRoute || !trackSrc) return;

    tryPlay();
    const onInteract = () => tryPlay();
    window.addEventListener("pointerdown", onInteract);
    return () => window.removeEventListener("pointerdown", onInteract);
  }, [adminRoute, tryPlay, trackSrc]);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (adminRoute) {
      audio.pause();
      return;
    }

    if (audio.paused && unlockedRef.current) {
      tryPlay();
    }
  }, [adminRoute, tryPlay]);

  function onBufferReady() {
    tryPlay();
  }

  function onVolumeChange(value: number) {
    const next = Math.min(1, Math.max(0, value));
    setVolume(next);
    if (trackSrc) {
      localStorage.setItem(volumeStorageKey(trackSrc), String(next));
    }
    if (audioRef.current) {
      audioRef.current.volume = next;
    }
  }

  return (
    <>
      {trackSrc && (
        <audio
          ref={audioRef}
          src={trackSrc}
          preload="auto"
          playsInline
          autoPlay
          onEnded={onTrackEnded}
          onLoadedMetadata={onBufferReady}
          onLoadedData={onBufferReady}
          onCanPlay={onBufferReady}
          onCanPlayThrough={onBufferReady}
          className="hidden"
        />
      )}
      {!adminRoute && trackSrc && (
        <div className="audio-controls fixed z-40 flex">
          <p
            className="audio-now-playing"
            title={titleForTrack(trackSrc)}
            aria-live="polite"
          >
            {titleForTrack(trackSrc)}
          </p>
          <label className="sr-only" htmlFor="bgm-volume">
            Background volume
          </label>
          <input
            id="bgm-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="bgm-slider w-[min(6.75rem,34vw)] shrink-0 sm:w-[6.5rem]"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(volume * 100)}
            aria-valuetext={`${Math.round(volume * 100)} percent`}
          />
        </div>
      )}
    </>
  );
}