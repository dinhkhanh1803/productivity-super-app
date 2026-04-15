"use client";

import { useState } from "react";
import { useFocusStore } from "@/store/focusStore";
import { Track } from "@/types";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Trash2, Link as LinkIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_TRACKS: Omit<Track, "id">[] = [
  { title: "Lofi Study Girl", type: "preset", url: "https://r.mkhairi.com/lofi" },
  { title: "Deep Focus Ambient", type: "preset", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { title: "Chillhop Radio", type: "preset", url: "https://eno.chillhop.com/radio" },
];

export function PlaylistDrawer({ open, onOpenChange }: PlaylistDrawerProps) {
  const { playlist, currentTrack, setTrack, addTrack, removeTrack, setIsPlayingTrack } = useFocusStore();
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    addTrack({
      id: generateId(),
      title: "Online Stream " + (playlist.length + 1),
      url: urlInput,
      type: "online"
    });
    setUrlInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Note: createObjectURL creates a session-bound URL.
    // In a fully persistent app, IndexedDB should store the actual Blob.
    const url = URL.createObjectURL(file);
    const track = {
      id: generateId(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      url,
      type: "local"
    } satisfies Track;

    addTrack(track);
    setTrack(track);
    setIsPlayingTrack(true);

    e.target.value = "";
  };

  const playTrack = (track: Track) => {
    setTrack(track);
    setIsPlayingTrack(true);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="bg-[#111] border-white/10 text-white p-0 flex flex-col w-[350px]">
        <SheetHeader className="p-6 border-b border-white/10 shrink-0">
          <SheetTitle className="text-white">Music Player</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="playlist" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="w-full bg-white/5 border border-white/10 grid grid-cols-2 h-9 p-1">
              <TabsTrigger value="playlist" className="text-xs font-semibold data-[state=active]:bg-white/10 data-[state=active]:text-white">Playlist</TabsTrigger>
              <TabsTrigger value="presets" className="text-xs font-semibold data-[state=active]:bg-white/10 data-[state=active]:text-white">Presets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="playlist" className="flex-1 overflow-y-auto p-6 space-y-6 outline-none mt-0">
            {/* Add Custom Track */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Add Track</span>
              <div className="flex gap-2">
                <Input 
                  placeholder="Paste Audio URL..." 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white/5 border-white/10 focus-visible:ring-white/20 h-9 text-sm"
                />
                <Button size="icon" className="h-9 w-9 shrink-0 bg-white/10 hover:bg-white/20 text-white" onClick={handleAddUrl}>
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full h-9 bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white pointer-events-none">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Local MP3
                </Button>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/5" />

            {/* Current Playlist */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Your Playlist</span>
              {playlist.length === 0 ? (
                <p className="text-xs text-white/40 text-center py-4">No tracks added yet.</p>
              ) : (
                <div className="space-y-1">
                  {playlist.map((track) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <div 
                        key={track.id} 
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg group transition-colors",
                          isActive ? "bg-white/10" : "hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => playTrack(track)}>
                          <div className={cn(
                            "h-8 w-8 rounded flex items-center justify-center shrink-0 transition-colors",
                            isActive ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
                          )}>
                            <Play className="h-4 w-4 ml-0.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={cn("text-sm font-medium truncate", isActive ? "text-white" : "text-white/70")}>{track.title}</span>
                            <span className="text-[10px] text-white/30 uppercase font-bold">{track.type}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-white/30 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          onClick={() => removeTrack(track.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="flex-1 overflow-y-auto p-6 space-y-3 outline-none mt-0">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Available Presets</span>
            <div className="space-y-2">
              {PRESET_TRACKS.map((track, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white">{track.title}</span>
                    <span className="text-xs text-white/40 truncate mt-0.5">{track.url}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="shrink-0 bg-white text-black hover:bg-white/90 font-bold ml-3"
                    onClick={() => addTrack({ ...track, id: generateId() })}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
