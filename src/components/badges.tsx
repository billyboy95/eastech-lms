import type { CampusTrack, Role } from "@prisma/client";
import { campusTrackMeta } from "@/lib/campus";

export function RoleBadge({ role }: { role: Role }) {
  const label = role === "EDUCATOR" ? "Educator" : "Student";
  const tone =
    role === "EDUCATOR"
      ? "bg-gold/15 text-gold ring-gold/30"
      : "bg-sea/10 text-sea ring-sea/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}
    >
      {label}
    </span>
  );
}

export function TrackBadge({ track }: { track: CampusTrack }) {
  return (
    <span className="inline-flex items-center rounded-full bg-foam px-2.5 py-0.5 text-xs font-medium text-navy ring-1 ring-inset ring-navy/10">
      {campusTrackMeta(track).shortLabel}
    </span>
  );
}
