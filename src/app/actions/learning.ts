"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEnroll, canViewFullLesson } from "@/lib/roles";
import { computeProgress, enrollmentStatusFromProgress } from "@/lib/progress";

export async function enrollInCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Sign in with a demo student to enroll.");
  }
  if (!canEnroll(user.role)) {
    throw new Error("Educator personas review courses from Studio instead of enrolling.");
  }
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course?.published) {
    throw new Error("That course is not open for enrollment.");
  }
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: {},
    create: { userId: user.id, courseId },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${slug}`);
}

export async function completeLesson(formData: FormData) {
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Sign in to mark a lesson complete.");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  const enrolled = Boolean(
    await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: lesson.courseId } },
    }),
  );

  if (
    !canViewFullLesson({
      role: user.role,
      userId: user.id,
      educatorId: lesson.course.educatorId,
      enrolled,
    })
  ) {
    throw new Error("Enroll in this course before recording progress.");
  }

  if (user.role === "STUDENT") {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: {},
      create: { userId: user.id, lessonId },
    });

    const [total, completed] = await Promise.all([
      prisma.lesson.count({ where: { courseId: lesson.courseId } }),
      prisma.lessonProgress.count({
        where: { userId: user.id, lesson: { courseId: lesson.courseId } },
      }),
    ]);
    const progress = computeProgress(completed, total);
    await prisma.enrollment.update({
      where: { userId_courseId: { userId: user.id, courseId: lesson.courseId } },
      data: { status: enrollmentStatusFromProgress(progress.percent) },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(`/courses/${courseSlug}/lessons/${lesson.slug}`);
}
