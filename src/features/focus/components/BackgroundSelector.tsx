"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFocusStore } from "@/store/focusStore";
import { BackgroundType } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Image as ImageIcon, Video, Palette, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  { id: "color-dark", label: "Dark Mode", type: "color" as const, url: "#09090b", thumb: "#09090b" },
  { id: "color-accent", label: "Accent", type: "color" as const, url: "var(--primary)", thumb: "#3b82f6" },
];

type RemoteBackground = {
  id: string;
  label: string;
  type: Exclude<BackgroundType, "color">;
  url: string;
  thumb: string;
};

export function BackgroundSelector({ open, onOpenChange }: BackgroundSelectorProps) {
  const { background, setBackground } = useFocusStore();
  const [remoteBackgrounds, setRemoteBackgrounds] = useState<RemoteBackground[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || remoteBackgrounds.length > 0) return;

    let cancelled = false;

    async function loadBackgrounds() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pixabay/backgrounds");
        const data = (await response.json()) as {
          backgrounds?: RemoteBackground[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Failed to load Pixabay backgrounds");
        }

        if (!cancelled) {
          setRemoteBackgrounds(data.backgrounds || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load Pixabay backgrounds");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBackgrounds();

    return () => {
      cancelled = true;
    };
  }, [open, remoteBackgrounds.length]);

  const backgrounds = [...PRESET_BACKGROUNDS, ...remoteBackgrounds];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type: BackgroundType = file.type.startsWith("video/") ? "video" : "image";
    
    setBackground({ type, url, opacity: 1 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px] bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Choose Background</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="relative">
            <input 
              type="file" 
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white border-dashed pointer-events-none">
              <Upload className="mr-2 h-4 w-4" />
              Upload Custom Image/Video
            </Button>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Presets</span>
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map((preset) => {
                const isActive = background.url === preset.url;
                
                return (
                  <div
                    key={preset.id}
                    onClick={() => setBackground({ type: preset.type, url: preset.url, opacity: 1 })}
                    className={cn(
                      "relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all",
                      isActive ? "border-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" : "border-transparent hover:border-white/20"
                    )}
                  >
                    {preset.type === "color" && (
                      <div className="absolute inset-0" style={{ background: preset.thumb }} />
                    )}
                    {preset.type === "image" && (
                      <Image src={preset.thumb} alt={preset.label} fill className="absolute inset-0 h-full w-full object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                    )}
                    {preset.type === "video" && (
                      <Image src={preset.thumb} alt={preset.label} fill className="absolute inset-0 h-full w-full object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-white drop-shadow-md">{preset.label}</span>
                      {preset.type === "color" && <Palette className="h-3 w-3 text-white/80" />}
                      {preset.type === "image" && <ImageIcon className="h-3 w-3 text-white/80" />}
                      {preset.type === "video" && <Video className="h-3 w-3 text-white/80" />}
                    </div>

                    {isActive && (
                      <div className="absolute top-2 right-2 h-5 w-5 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-lg">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {loading && (
              <p className="text-xs text-white/40">Loading Pixabay backgrounds...</p>
            )}
            {error && (
              <p className="text-xs text-red-300/80">{error}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
