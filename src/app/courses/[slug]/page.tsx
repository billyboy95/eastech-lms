import Link from "next/link";
import { notFound } from "next/navigation";
import { enrollInCourse } from "@/app/actions/learning";
import { RoleBadge, TrackBadge } from "@/components/badges";
import { ProgressBar } from "@/components/progress-bar";
import { getSessionUser } from "@/lib/auth";
import { campusTrackMeta } from "@/lib/campus";
import { getCourseBySlug, getCourseProgress, getEnrollment } from "@/lib/queries";
import { canEnroll, canManageCourse } from "@/lib/roles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "Course" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const user = await getSessionUser();
  const enrollment = user ? await getEnrollment(user.id, course.id) : null;
  const progress = user && enrollment ? await getCourseProgress(user.id, course.id) : null;
  const managing = user ? canManageCourse(user.role, course.educatorId, user.id) : false;

  return (
    <article className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <TrackBadge track={course.campusTrack} />
          {managing ? <RoleBadge role="EDUCATOR" /> : null}
        </div>
        <h1 className="mt-4 font-display text-4xl text-navy">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-navy/70">{course.description}</p>
        <p className="mt-4 text-sm text-navy/55">
          {campusTrackMeta(course.campusTrack).label} · {course.educator.displayName} ·{" "}
          {course._count.enrollments} enrolled · {course.lessons.length} lessons
        </p>

        {progress ? (
          <div className="mt-6 max-w-md">
            <ProgressBar percent={progress.percent} label="Your progress" />
          </div>
        ) : null}

        <div className="mt-6">
          {!user ? (
            <Link
              href="/login"
              className="inline-flex rounded-full bg-navy px-4 py-2 text-sm text-foam hover:bg-sea"
            >
              Sign in to enroll
            </Link>
          ) : canEnroll(user.role) && !enrollment ? (
            <form action={enrollInCourse}>
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="slug" value={course.slug} />
              <button
                type="submit"
                className="rounded-full bg-navy px-4 py-2 text-sm text-foam hover:bg-sea"
              >
                Enroll in this course
              </button>
            </form>
          ) : enrollment ? (
            <p className="text-sm font-medium text-sea">You are enrolled.</p>
          ) : (
            <p className="text-sm text-navy/60">
              Educator personas review courses from Studio rather than enrolling.
            </p>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-display text-2xl text-navy">Lessons</h2>
        <ol className="mt-4 space-y-3">
          {course.lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-navy/10 bg-white px-5 py-4 hover:border-sea/40"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-navy/45">
                    Lesson {lesson.order}
                  </p>
                  <h3 className="font-display text-lg text-navy">{lesson.title}</h3>
                  <p className="mt-1 text-sm text-navy/65">{lesson.summary}</p>
                </div>
                <span className="shrink-0 text-xs text-navy/45">{lesson.durationMin} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
