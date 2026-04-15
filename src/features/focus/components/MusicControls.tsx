"use client";

import { useFocusStore } from "@/store/focusStore";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MusicControlsProps {
  onOpenPlaylist: () => void;
}

export function MusicControls({ onOpenPlaylist }: MusicControlsProps) {
  const { 
    currentTrack, 
    isPlayingTrack, 
    volume, 
    togglePlayback, 
    nextTrack, 
    prevTrack, 
    setVolume 
  } = useFocusStore();

  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-[150px] sm:w-[200px]">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center border border-white/5">
          <ListMusic className="h-4 w-4 text-white/70" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate">
            {currentTrack?.title || "No track selected"}
          </span>
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
            {currentTrack?.type || "Music"}
          </span>
        </div>
      </div>

      <div className="w-[1px] h-8 bg-white/10" />

      {/* Main Controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10 rounded-full h-9 w-9"
          onClick={prevTrack}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full h-12 w-12 transition-all shadow-lg",
            isPlayingTrack 
              ? "bg-white/20 hover:bg-white/30 text-white" 
              : "bg-white text-black hover:bg-white/90 hover:scale-105"
          )}
          onClick={togglePlayback}
        >
          {isPlayingTrack ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10 rounded-full h-9 w-9"
          onClick={nextTrack}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />

      {/* Volume & Playlist */}
      <div className="hidden sm:flex items-center gap-3">
        <div 
          className="flex items-center gap-2"
          onMouseEnter={() => setIsHoveringVolume(true)}
          onMouseLeave={() => setIsHoveringVolume(false)}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" onClick={() => setVolume(volume === 0 ? 50 : 0)}>
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className={cn("overflow-hidden transition-all duration-300", isHoveringVolume ? "w-20 opacity-100" : "w-0 opacity-0")}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
            />
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10" onClick={onOpenPlaylist}>
          <ListMusic className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Playlist Toggle */}
      <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8 text-white ml-auto" onClick={onOpenPlaylist}>
        <ListMusic className="h-4 w-4" />
      </Button>
    </div>
  );
}
