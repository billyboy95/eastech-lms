import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { CAMPUS_TRACKS, isCampusTrack } from "@/lib/campus";
import { getPublishedCourses } from "@/lib/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const activeTrack = isCampusTrack(track) ? track : undefined;
  const courses = await getPublishedCourses(activeTrack);

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl bg-navy px-6 py-12 text-foam sm:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">East Sea Technocentric</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
          A starter LMS for EASTC’s four campuses.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-foam/75">
          Students enroll in published courses. Educators review a studio roster. Demo personas
          stand in for real accounts — no live student data lives here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-navy hover:bg-gold/90"
          >
            Sign in as a demo persona
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 px-5 py-2 text-sm hover:border-gold hover:text-gold"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-navy">Course catalog</h2>
            <p className="mt-1 text-sm text-navy/60">Filter by campus track or browse everything.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`rounded-full px-3 py-1 text-sm ${
                !activeTrack ? "bg-navy text-foam" : "bg-white text-navy ring-1 ring-navy/10"
              }`}
            >
              All
            </Link>
            {CAMPUS_TRACKS.map((item) => (
              <Link
                key={item.value}
                href={`/?track=${item.value}`}
                className={`rounded-full px-3 py-1 text-sm ${
                  activeTrack === item.value
                    ? "bg-navy text-foam"
                    : "bg-white text-navy ring-1 ring-navy/10"
                }`}
              >
                {item.shortLabel}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              slug={course.slug}
              title={course.title}
              summary={course.summary}
              campusTrack={course.campusTrack}
              educatorName={course.educator.displayName}
              lessonCount={course.lessons.length}
              enrollmentCount={course._count.enrollments}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
