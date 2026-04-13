import type { Metadata } from "next";
import { GreetingSection }    from "@/features/dashboard/GreetingSection";
import { ScheduleSection }    from "@/features/dashboard/ScheduleSection";
import { QuickActionsSection } from "@/features/dashboard/QuickActionsSection";
import { FestivalsSection }   from "@/features/dashboard/FestivalsSection";
import { StorageSection }     from "@/features/dashboard/StorageSection";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="min-h-full px-5 py-7 sm:px-8 sm:py-9 space-y-7 max-w-[1400px] mx-auto">
      {/* Section 1 — Greeting */}
      <GreetingSection />

      {/* Section 2 — Today + Tomorrow schedule (2 cols) */}
      <ScheduleSection />

      {/* Section 3 — Tasks + Focus + Finance (3 cols) */}
      <QuickActionsSection />

      {/* Section 4 — Upcoming festivals */}
      <FestivalsSection />

      {/* Section 5 — Storage & Media */}
      <StorageSection />
    </div>
  );
}
