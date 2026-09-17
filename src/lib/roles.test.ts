import { CampusTrack, Role } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  canEnroll,
  canManageCourse,
  canViewFullLesson,
  isEducator,
  isStudent,
} from "@/lib/roles";

describe("roles", () => {
  it("lets only students enroll", () => {
    expect(canEnroll(Role.STUDENT)).toBe(true);
    expect(canEnroll(Role.EDUCATOR)).toBe(false);
  });

  it("lets an educator manage only their own course", () => {
    expect(canManageCourse(Role.EDUCATOR, "edu-1", "edu-1")).toBe(true);
    expect(canManageCourse(Role.EDUCATOR, "edu-1", "edu-2")).toBe(false);
    expect(canManageCourse(Role.STUDENT, "edu-1", "edu-1")).toBe(false);
  });

  it("opens full lessons to enrolled students and the course educator", () => {
    expect(
      canViewFullLesson({
        role: Role.STUDENT,
        userId: "stu-1",
        educatorId: "edu-1",
        enrolled: true,
      }),
    ).toBe(true);
    expect(
      canViewFullLesson({
        role: Role.STUDENT,
        userId: "stu-1",
        educatorId: "edu-1",
        enrolled: false,
      }),
    ).toBe(false);
    expect(
      canViewFullLesson({
        role: Role.EDUCATOR,
        userId: "edu-1",
        educatorId: "edu-1",
        enrolled: false,
      }),
    ).toBe(true);
  });

  it("labels the two demo roles", () => {
    expect(isEducator(Role.EDUCATOR)).toBe(true);
    expect(isStudent(Role.STUDENT)).toBe(true);
    expect(isEducator(Role.STUDENT)).toBe(false);
  });
});

describe("campus track enum is wired for seeds", () => {
  it("includes EASTC’s four campuses", () => {
    expect(Object.values(CampusTrack)).toEqual(
      expect.arrayContaining([
        CampusTrack.SCHOOL,
        CampusTrack.ARTISAN_COLLEGE,
        CampusTrack.VARSITY,
        CampusTrack.FOOD_COURT,
      ]),
    );
  });
});
