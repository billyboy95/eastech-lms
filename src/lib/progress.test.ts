import { describe, expect, it } from "vitest";
import { computeProgress, enrollmentStatusFromProgress } from "@/lib/progress";

describe("computeProgress", () => {
  it("returns 0% when a course has no lessons", () => {
    expect(computeProgress(0, 0)).toEqual({ completed: 0, total: 0, percent: 0 });
  });

  it("rounds a partial course to the nearest percent", () => {
    expect(computeProgress(1, 3)).toEqual({ completed: 1, total: 3, percent: 33 });
    expect(computeProgress(2, 3)).toEqual({ completed: 2, total: 3, percent: 67 });
  });

  it("caps completed lessons at the course total", () => {
    expect(computeProgress(5, 3)).toEqual({ completed: 3, total: 3, percent: 100 });
  });

  it("rejects negative counts", () => {
    expect(() => computeProgress(-1, 3)).toThrow(/negative/);
  });
});

describe("enrollmentStatusFromProgress", () => {
  it("marks a course completed only at 100%", () => {
    expect(enrollmentStatusFromProgress(99)).toBe("ACTIVE");
    expect(enrollmentStatusFromProgress(100)).toBe("COMPLETED");
  });
});
