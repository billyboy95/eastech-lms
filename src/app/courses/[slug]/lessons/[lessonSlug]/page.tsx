import Link from "next/link";
import { notFound } from "next/navigation";
import { completeLesson } from "@/app/actions/learning";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canViewFullLesson } from "@/lib/roles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  return { title: lessonSlug.replace(/-/g, " ") };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug: lessonSlug, course: { slug } },
    include: {
      course: {
        include: {
          lessons: { orderBy: { order: "asc" }, select: { slug: true, title: true, order: true } },
        },
      },
      progress: true,
    },
  });
  if (!lesson) {
    notFound();
  }

  const user = await getSessionUser();
  const enrolled = user
    ? Boolean(
        await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: user.id, courseId: lesson.courseId } },
        }),
      )
    : false;
  const unlocked = user
    ? canViewFullLesson({
        role: user.role,
        userId: user.id,
        educatorId: lesson.course.educatorId,
        enrolled,
      })
    : false;
  const completed = user
    ? lesson.progress.some((row) => row.userId === user.id)
    : false;

  const index = lesson.course.lessons.findIndex((item) => item.slug === lesson.slug);
  const previous = index > 0 ? lesson.course.lessons[index - 1] : null;
  const next = index >= 0 ? lesson.course.lessons[index + 1] : undefined;

  return (
    <article className="space-y-8">
      <p className="text-sm text-navy/55">
        <Link href={`/courses/${slug}`} className="hover:text-sea">
          {lesson.course.title}
        </Link>
        <span className="mx-2">/</span>
        Lesson {lesson.order}
      </p>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10 sm:p-8">
        <h1 className="font-display text-4xl text-navy">{lesson.title}</h1>
        <p className="mt-2 text-navy/60">{lesson.summary}</p>
        {unlocked ? (
          <div className="mt-6 space-y-6">
            <p className="max-w-3xl text-base leading-7 text-navy/80">{lesson.content}</p>
            {user?.role === "STUDENT" && enrolled ? (
              <form action={completeLesson}>
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="courseSlug" value={slug} />
                <button
                  type="submit"
                  disabled={completed}
                  className="rounded-full bg-navy px-4 py-2 text-sm text-foam hover:bg-sea disabled:cursor-default disabled:bg-sea/40"
                >
                  {completed ? "Lesson completed" : "Mark lesson complete"}
                </button>
              </form>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-sand p-5 text-sm text-navy/70">
            <p>Full lesson text unlocks after a student enrolls (or when the course educator is signed in).</p>
            <Link href="/login" className="mt-3 inline-block text-sea hover:underline">
              Choose a demo persona
            </Link>
          </div>
        )}
      </div>
      <nav className="flex justify-between text-sm">
        {previous ? (
          <Link className="text-sea hover:underline" href={`/courses/${slug}/lessons/${previous.slug}`}>
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="text-sea hover:underline" href={`/courses/${slug}/lessons/${next.slug}`}>
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
