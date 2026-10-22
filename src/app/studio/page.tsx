import Link from "next/link";
import { redirect } from "next/navigation";
import { ProgressBar } from "@/components/progress-bar";
import { TrackBadge } from "@/components/badges";
import { getSessionUser } from "@/lib/auth";
import { getEducatorStudio } from "@/lib/queries";
import { isEducator } from "@/lib/roles";

export const metadata = { title: "Educator studio" };

export default async function StudioPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (!isEducator(user.role)) {
    redirect("/dashboard");
  }

  const courses = await getEducatorStudio(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy">Studio</h1>
        <p className="mt-2 text-navy/65">
          {user.displayName} · courses you author, with demo rosters only.
        </p>
      </div>
      {courses.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-navy/70 ring-1 ring-navy/10">
          This educator persona has no courses in the seed yet.
        </p>
      ) : (
        courses.map((course) => (
          <section
            key={course.id}
            className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <TrackBadge track={course.campusTrack} />
              <span className="text-xs text-navy/45">
                {course.lessons.length} lessons · {course.enrollments.length} students
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl text-navy">
              <Link href={`/courses/${course.slug}`} className="hover:text-sea">
                {course.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-navy/60">{course.summary}</p>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-navy/45">
                  <tr>
                    <th className="pb-2 pr-4 font-medium">Student</th>
                    <th className="pb-2 pr-4 font-medium">Track</th>
                    <th className="pb-2 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {course.enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-t border-navy/10">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-navy">{enrollment.user.displayName}</div>
                        <div className="text-xs text-navy/45">{enrollment.user.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <TrackBadge track={enrollment.user.campusTrack} />
                      </td>
                      <td className="py-3 min-w-48">
                        <ProgressBar percent={enrollment.progress.percent} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {course.enrollments.length === 0 ? (
                <p className="mt-3 text-sm text-navy/55">No demo students enrolled yet.</p>
              ) : null}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
