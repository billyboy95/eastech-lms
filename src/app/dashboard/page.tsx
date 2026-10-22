import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressBar } from "@/components/progress-bar";
import { TrackBadge } from "@/components/badges";
import { getSessionUser } from "@/lib/auth";
import { getStudentDashboard } from "@/lib/queries";
import { isEducator } from "@/lib/roles";

export const metadata = { title: "Student dashboard" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (isEducator(user.role)) {
    redirect("/studio");
  }

  const enrollments = await getStudentDashboard(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy">Your learning</h1>
        <p className="mt-2 text-navy/65">
          {user.displayName} · {user.email} — demo student, not a real enrolment record.
        </p>
      </div>
      {enrollments.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-navy/70 ring-1 ring-navy/10">
          No courses yet.{" "}
          <Link href="/" className="text-sea hover:underline">
            Browse the catalog
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-4">
          {enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <TrackBadge track={enrollment.course.campusTrack} />
                <span className="text-xs uppercase tracking-wide text-navy/45">
                  {enrollment.status.toLowerCase()}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl text-navy">
                <Link href={`/courses/${enrollment.course.slug}`} className="hover:text-sea">
                  {enrollment.course.title}
                </Link>
              </h2>
              <p className="text-sm text-navy/55">With {enrollment.course.educator.displayName}</p>
              <div className="mt-4 max-w-md">
                <ProgressBar
                  percent={enrollment.progress.percent}
                  label={`${enrollment.progress.completed} of ${enrollment.progress.total} lessons`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
