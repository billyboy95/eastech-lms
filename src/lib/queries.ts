import { CampusTrack } from "@prisma/client";
import { prisma } from "@/lib/db";
import { computeProgress } from "@/lib/progress";

export async function getPublishedCourses(track?: CampusTrack) {
  return prisma.course.findMany({
    where: {
      published: true,
      ...(track ? { campusTrack: track } : {}),
    },
    include: {
      educator: {
        select: { id: true, displayName: true, email: true, campusTrack: true },
      },
      lessons: { select: { id: true }, orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { title: "asc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      educator: {
        select: {
          id: true,
          displayName: true,
          email: true,
          campusTrack: true,
          bio: true,
        },
      },
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

export async function getCourseProgress(userId: string, courseId: string) {
  const [lessons, completed] = await Promise.all([
    prisma.lesson.count({ where: { courseId } }),
    prisma.lessonProgress.count({
      where: { userId, lesson: { courseId } },
    }),
  ]);
  return computeProgress(completed, lessons);
}

export async function getStudentDashboard(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          educator: { select: { displayName: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const progress = await getCourseProgress(userId, enrollment.courseId);
      return { ...enrollment, progress };
    }),
  );
}

export async function getEducatorStudio(educatorId: string) {
  const courses = await prisma.course.findMany({
    where: { educatorId },
    include: {
      lessons: { select: { id: true, title: true, order: true }, orderBy: { order: "asc" } },
      enrollments: {
        include: {
          user: {
            select: { id: true, displayName: true, email: true, campusTrack: true },
          },
        },
        orderBy: { enrolledAt: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  return Promise.all(
    courses.map(async (course) => {
      const rosters = await Promise.all(
        course.enrollments.map(async (enrollment) => ({
          ...enrollment,
          progress: await getCourseProgress(enrollment.userId, course.id),
        })),
      );
      return { ...course, enrollments: rosters };
    }),
  );
}
