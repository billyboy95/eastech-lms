import { CampusTrack, Role } from "@prisma/client";

export const SESSION_COOKIE = "eastc_demo_session";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  campusTrack: CampusTrack;
  bio: string;
};

export function isEducator(role: Role): boolean {
  return role === Role.EDUCATOR;
}

export function isStudent(role: Role): boolean {
  return role === Role.STUDENT;
}

export function canEnroll(role: Role): boolean {
  return role === Role.STUDENT;
}

export function canManageCourse(role: Role, educatorId: string, userId: string): boolean {
  return role === Role.EDUCATOR && educatorId === userId;
}

export function canViewFullLesson(options: {
  role: Role;
  userId: string;
  educatorId: string;
  enrolled: boolean;
}): boolean {
  if (canManageCourse(options.role, options.educatorId, options.userId)) {
    return true;
  }
  return options.enrolled;
}
