import type { CampusTrack } from "@prisma/client";
import Link from "next/link";
import { TrackBadge } from "@/components/badges";
import { campusTrackMeta } from "@/lib/campus";

type CourseCardProps = {
  slug: string;
  title: string;
  summary: string;
  campusTrack: CampusTrack;
  educatorName: string;
  lessonCount: number;
  enrollmentCount: number;
};

export function CourseCard({
  slug,
  title,
  summary,
  campusTrack,
  educatorName,
  lessonCount,
  enrollmentCount,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sea/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <TrackBadge track={campusTrack} />
        <span className="text-xs text-navy/50">
          {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl text-navy group-hover:text-sea">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-navy/70">{summary}</p>
      <p className="mt-4 text-xs text-navy/50">
        {campusTrackMeta(campusTrack).label} · {educatorName} · {enrollmentCount} enrolled
      </p>
    </Link>
  );
}
