"use client";

import { useFocusStore } from "@/store/focusStore";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer to prevent SSR hydration errors
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function MusicPlayer() {
  const { currentTrack, isPlayingTrack, volume, nextTrack, setIsPlayingTrack } = useFocusStore();
  if (!currentTrack) return null;

  return (
    <div className="hidden pointer-events-none">
      <ReactPlayer
        src={currentTrack.url}
        playing={isPlayingTrack}
        volume={volume / 100}
        onEnded={nextTrack}
        onPause={() => setIsPlayingTrack(false)}
        onPlay={() => setIsPlayingTrack(true)}
        width="0"
        height="0"
        playsInline
        config={{
          youtube: {
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          }
        }}
        onError={(e) => console.error("ReactPlayer playback error:", e)}
      />
    </div>
  );
}
