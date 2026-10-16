"use client";

import { useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/site";

type Mode = "idle" | "walk" | "talk";
type Side = "left" | "right";
export type Line = { id: number; text: string };

const MODES: Mode[] = ["idle", "walk", "talk"];
const SPEED = 90;
const WANDER_AFTER = 25000;
const GREETING = "Hi! Ask me anything about your treatment, I'm here to help.";

function talkTime(text: string) {
  return Math.min(9000, Math.max(2500, text.length * 55));
}

function key(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const image = ctx.getImageData(0, 0, width, height);
  const px = image.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const most = r > b ? r : b;
    const green = g - most;
    if (green > 0) {
      px[i + 1] = most;
      px[i + 3] = green >= 100 ? 0 : green <= 30 ? 255 : Math.round(255 * (1 - (green - 30) / 70));
    }
  }
  ctx.putImageData(image, 0, 0);
}

export function FloatingAvatar({ line }: { line: Line | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const videos = useRef<Partial<Record<Mode, HTMLVideoElement>>>({});
  const mode = useRef<Mode>("walk");
  const timer = useRef<number>(0);
  const [x, setX] = useState<number | null>(null);
  const [side, setSide] = useState<Side>("right");
  const [facing, setFacing] = useState<Side>("left");
  const [walkMs, setWalkMs] = useState(0);
  const [talking, setTalking] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [typing, setTyping] = useState(false);
  const [walking, setWalking] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const still = useRef(false);
  const spoke = useRef(false);
  const at = useRef<{ x: number | null; side: Side }>({ x: null, side: "right" });

  function spots() {
    const width = window.innerWidth;
    const w = box.current?.offsetWidth ?? 150;
    return { left: 4, right: width - w - 4, off: width + 10 };
  }

  function play(next: Mode) {
    mode.current = next;
    setWalking(next === "walk");
    const video = videos.current[next];
    if (!video) return;
    if (next === "talk") video.currentTime = 0;
    if (!still.current) video.play().catch(() => {});
  }

  function walkTo(to: Side, then: () => void) {
    const target = spots()[to];
    const from = at.current.x ?? spots().off;
    const ms = still.current ? 0 : (Math.abs(target - from) / SPEED) * 1000;
    window.clearTimeout(timer.current);
    setFacing(target < from ? "left" : "right");
    setWalkMs(ms);
    at.current = { x: target, side: to };
    setX(target);
    setSide(to);
    play(ms ? "walk" : "idle");
    timer.current = window.setTimeout(then, ms);
  }

  function say(text: string) {
    spoke.current = true;
    window.clearTimeout(timer.current);
    setTalking(text);
    play("talk");
    timer.current = window.setTimeout(() => {
      setTalking(null);
      play("idle");
      timer.current = window.setTimeout(wander, WANDER_AFTER);
    }, talkTime(text));
  }

  function wander() {
    walkTo(at.current.side === "right" ? "left" : "right", () => {
      play("idle");
      timer.current = window.setTimeout(wander, WANDER_AFTER);
    });
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
        video.setAttribute("aria-hidden", "true");
        videos.current[name] = video;
      }
      let last = -1;
      let lastMode: Mode | null = null;
      const draw = () => {
        frame = requestAnimationFrame(draw);
        const video = list[mode.current];
        const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
        if (!video || !ctx || video.readyState < 2) return;
        if (video.currentTime === last && mode.current === lastMode) return;
        last = video.currentTime;
        lastMode = mode.current;
        const { width, height: h } = ctx.canvas;
        ctx.clearRect(0, 0, width, h);
        ctx.drawImage(video, 0, 0, width, h);
        key(ctx, width, h);
      };
      frame = requestAnimationFrame(draw);
      wait = window.setTimeout(() => {
        if (!spoke.current) walkTo("right", () => say(GREETING));
      }, 600);
    };

    const kick = () => {
      wait = window.setTimeout(begin, 1500);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    const focus = (event: FocusEvent) => setTyping(event.target instanceof HTMLInputElement);
    const blur = () => setTyping(false);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wait);
      window.removeEventListener("load", kick);
      window.clearTimeout(timer.current);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", blur);
      for (const video of Object.values(list)) {
        video?.pause();
        video?.removeAttribute("src");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!line) return;
    walkTo(at.current.side === "right" ? "left" : "right", () => say(line.text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line]);

  const away = hidden || typing;

  return (
    <>
      <div
        ref={box}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[76px] left-0 z-30 h-[min(34vh,280px)] aspect-[258/480]"
        style={{
          opacity: away || x === null ? 0 : 1,
          transform: x === null ? "translateX(100vw)" : `translateX(${x}px)`,
          transition: `transform ${walkMs}ms linear, opacity 300ms`,
        }}
      >
        <canvas
          ref={canvas}
          width={258}
          height={480}
          className="h-full w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)]"
          style={{ transform: walking && facing === "left" ? "scaleX(-1)" : undefined }}
        />
        {talking && (
          <p
            className={`absolute bottom-[55%] w-[min(58vw,240px)] rounded-2xl bg-pink px-4 py-3 text-sm leading-snug text-ink shadow-lg ${
              side === "right" ? "right-[92%] rounded-br-sm" : "left-[92%] rounded-bl-sm"
            }`}
          >
            <span className="mb-1 block text-xs font-bold">Dr. Akanksha</span>
            <span className="line-clamp-6">{talking}</span>
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setHidden((value) => !value)}
        className="fixed bottom-[84px] left-3 z-40 rounded-full bg-ground/80 px-3 py-1.5 text-xs font-semibold text-pink ring-1 ring-pink/40 backdrop-blur"
      >
        {hidden ? "Show the doctor" : "Hide the doctor"}
      </button>
    </>
  );
}
