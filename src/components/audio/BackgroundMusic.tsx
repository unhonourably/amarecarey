"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "bgm-volume";

function readStoredVolume(): number {
  if (typeof window === "undefined") {
    return siteConfig.audio.defaultVolume;
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return siteConfig.audio.defaultVolume;
  const parsed = Number(saved);
  if (Number.isNaN(parsed)) return siteConfig.audio.defaultVolume;
  return Math.min(1, Math.max(0, parsed));
}

export function BackgroundMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const bootstrappedRef = useRef(false);
  const [volume, setVolume] = useState(readStoredVolume);
  const adminRoute = pathname.startsWith("/canes");

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    audio.loop = true;
    audio.volume = volume;
    audio.load();
    void audio.play().then(() => {
      unlockedRef.current = true;
    });
  }, []);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || !bootstrappedRef.current) return;
    audio.volume = volume;
  }, [volume]);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio || adminRoute) return;

    const tryPlay = () => {
      void audio.play().then(() => {
        unlockedRef.current = true;
      });
    };

    tryPlay();
    const onInteract = () => tryPlay();
    window.addEventListener("pointerdown", onInteract);
    return () => window.removeEventListener("pointerdown", onInteract);
  }, [adminRoute]);

  useLayoutEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (adminRoute) {
      audio.pause();
      return;
    }

    if (audio.paused && unlockedRef.current) {
      void audio.play().catch(() => {});
    }
  }, [adminRoute]);

  function onCanPlayThrough() {
    const audio = audioRef.current;
    if (!audio || adminRoute) return;
    void audio.play().then(() => {
      unlockedRef.current = true;
    });
  }

  function onVolumeChange(value: number) {
    const next = Math.min(1, Math.max(0, value));
    setVolume(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    if (audioRef.current) {
      audioRef.current.volume = next;
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={siteConfig.audio.src}
        preload="auto"
        loop
        playsInline
        autoPlay
        onCanPlayThrough={onCanPlayThrough}
        className="hidden"
      />
      {!adminRoute && (
        <div className="audio-controls fixed z-40 flex items-center gap-2">
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
            className="bgm-slider w-[5.5rem] sm:w-[6.5rem]"
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
