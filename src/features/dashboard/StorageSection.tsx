"use client";

import { motion } from "framer-motion";
import {
  HardDrive,
  Image as ImageIcon,
  Video,
  FileText,
  File,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/hooks/useT";

type FileType = "image" | "video" | "doc" | "other";

interface RecentFile {
  id: string;
  name: string;
  size: string;
  type: FileType;
  modifiedAt: string;
  modifiedAtVi: string;
}

const ICON: Record<FileType, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  doc: FileText,
  other: File,
};

const COLOR: Record<FileType, string> = {
  image: "bg-blue-500/15 text-blue-500",
  video: "bg-purple-500/15 text-purple-500",
  doc: "bg-amber-500/15 text-amber-500",
  other: "bg-slate-500/15 text-slate-500",
};

const recentFiles: RecentFile[] = [
  { id: "1", name: "dashboard-design.png", size: "2.4 MB", type: "image", modifiedAt: "Just now",    modifiedAtVi: "Vừa xong" },
  { id: "2", name: "onboarding-flow.mp4",  size: "48 MB",  type: "video", modifiedAt: "2h ago",      modifiedAtVi: "2 giờ trước" },
  { id: "3", name: "Q2-report.pdf",        size: "1.1 MB", type: "doc",   modifiedAt: "Yesterday",   modifiedAtVi: "Hôm qua" },
  { id: "4", name: "wireframes.fig",       size: "8.3 MB", type: "other", modifiedAt: "2 days ago",  modifiedAtVi: "2 ngày trước" },
  { id: "5", name: "product-photo.jpg",    size: "3.7 MB", type: "image", modifiedAt: "3 days ago",  modifiedAtVi: "3 ngày trước" },
  { id: "6", name: "intro-video.mp4",      size: "120 MB", type: "video", modifiedAt: "Last week",   modifiedAtVi: "Tuần trước" },
];

const storageUsedGB = 4.2;
const storageTotalGB = 15;
const storageUsedPct = Math.round((storageUsedGB / storageTotalGB) * 100);

export function StorageSection() {
  const { t, lang } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46, duration: 0.35 }}
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15">
                <HardDrive className="h-3.5 w-3.5 text-cyan-500" />
              </div>
              <CardTitle className="text-sm">{t("dashboard.storage")}</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-xl">
              <Upload className="h-3.5 w-3.5" />
              {t("dashboard.upload")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Storage bar */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{storageUsedGB} GB {lang === "vi" ? "đã dùng" : "used"}</span>
              <span className="text-[var(--muted-foreground)]">
                {lang === "vi" ? "của" : "of"} {storageTotalGB} GB
              </span>
            </div>
            <Progress value={storageUsedPct} className="h-2" />
            <div className="flex gap-3 text-[10px] text-[var(--muted-foreground)] flex-wrap">
              {[
                { label: lang === "vi" ? "Ảnh"   : "Images", pct: 35, color: "bg-blue-500" },
                { label: lang === "vi" ? "Video"  : "Videos", pct: 40, color: "bg-purple-500" },
                { label: lang === "vi" ? "Tài liệu" : "Docs", pct: 15, color: "bg-amber-500" },
                { label: lang === "vi" ? "Khác"   : "Other",  pct: 10, color: "bg-slate-400" },
              ].map((cat) => (
                <span key={cat.label} className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${cat.color}`} />
                  {cat.label} {cat.pct}%
                </span>
              ))}
            </div>
          </div>

          {/* File list */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {t("dashboard.recentFiles")}
            </p>
            <div className="space-y-0.5">
              {recentFiles.map((file, i) => {
                const Icon = ICON[file.type];
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[var(--muted)] transition-colors cursor-pointer"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${COLOR[file.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {file.size} · {lang === "vi" ? file.modifiedAtVi : file.modifiedAt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
