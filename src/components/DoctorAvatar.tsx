"use client";

import { useEffect, useRef, useState } from "react";
import { painter, type Painter } from "@/lib/chroma";
import { BASE_PATH } from "@/lib/site";

type Mode = "idle" | "walk" | "talk";
export type Mood = "hop" | "shake";
export type Line = { id: number; text: string; mood?: Mood };

const MODES: Mode[] = ["idle", "walk", "talk"];
const WALK_MS = 2200;

function talkTime(text: string) {
  return Math.min(8000, Math.max(1800, text.length * 50));
}

export function DoctorAvatar({ line, onPoke }: { line: Line | null; onPoke: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const videos = useRef<Partial<Record<Mode, HTMLVideoElement>>>({});
  const mode = useRef<Mode>("idle");
  const still = useRef(false);
  const timer = useRef(0);
  const spoken = useRef(0);
  const [stage, setStage] = useState<"away" | "walking" | "here">("away");
  const [mood, setMood] = useState<Mood | null>(null);

  function play(next: Mode) {
    mode.current = next;
    const video = videos.current[next];
    if (!video) return;
    if (next === "talk") video.currentTime = 0;
    if (!still.current) video.play().catch(() => {});
  }

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = videos.current;
    let frame = 0;
    let wait = 0;

    const begin = () => {
      for (const name of MODES) {
        const video = document.createElement("video");
        video.src = `${BASE_PATH}/avatar/${name}.mp4`;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        list[name] = video;
      }
      let last = -1;
      let lastMode: Mode | null = null;
      const paint: Painter | null = canvas.current ? painter(canvas.current) : null;
      const draw = () => {
        frame = requestAnimationFrame(draw);
        const video = list[mode.current];
        if (!video || !paint || video.readyState < 2) return;
        if (video.currentTime === last && mode.current === lastMode) return;
        last = video.currentTime;
        lastMode = mode.current;
        paint(video);
      };
      frame = requestAnimationFrame(draw);

      if (still.current) {
        play("idle");
        setStage("here");
        return;
      }
      play("walk");
      setStage("walking");
      wait = window.setTimeout(() => {
        play("idle");
        setStage("here");
      }, WALK_MS);
    };

    const kick = () => {
      wait = window.setTimeout(begin, 1200);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wait);
      window.clearTimeout(timer.current);
      window.removeEventListener("load", kick);
      for (const video of Object.values(list)) {
        video?.pause();
        video?.removeAttribute("src");
      }
    };
  }, []);

  useEffect(() => {
    if (stage !== "here" || !line || line.id === spoken.current) return;
    spoken.current = line.id;
    window.clearTimeout(timer.current);
    play("talk");
    const clear = window.setTimeout(() => setMood(null), 0);
    const next = line.mood && !still.current ? window.setTimeout(() => setMood(line.mood ?? null), 40) : 0;
    timer.current = window.setTimeout(() => {
      play("idle");
      setMood(null);
    }, talkTime(line.text));
    return () => {
      window.clearTimeout(clear);
      window.clearTimeout(next);
    };
  }, [line, stage]);

  return (
    <div className="relative h-[min(36vh,290px)] w-full">
      <div
        aria-hidden="true"
        className={`absolute bottom-0 left-0 z-10 aspect-[258/480] h-full ${mood ? `avatar-${mood}` : ""}`}
        style={{
          opacity: stage === "away" ? 0 : 1,
          transform: stage === "away" ? "translateX(100vw)" : "translateX(0)",
          transition: stage === "walking" ? `transform ${WALK_MS}ms linear, opacity 300ms` : "opacity 300ms",
        }}
      >
        <canvas
          ref={canvas}
          width={258}
          height={480}
          className="h-full w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)]"
          style={{ transform: stage === "walking" ? "scaleX(-1)" : undefined }}
        />
      </div>
      <button
        type="button"
        onClick={onPoke}
        disabled={stage !== "here"}
        aria-label="Say hello to the doctor"
        className="absolute bottom-0 left-0 z-20 aspect-[258/480] h-full cursor-pointer rounded-full"
      />
    </div>
  );
}
