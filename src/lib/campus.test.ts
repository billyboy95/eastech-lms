import { CampusTrack } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { CAMPUS_TRACKS, campusTrackMeta, isCampusTrack } from "@/lib/campus";

describe("campus tracks", () => {
  it("covers every Prisma campus track", () => {
    expect(CAMPUS_TRACKS.map((item) => item.value).sort()).toEqual(
      Object.values(CampusTrack).sort(),
    );
  });

  it("returns labels for the artisan college", () => {
    expect(campusTrackMeta(CampusTrack.ARTISAN_COLLEGE).label).toBe("Artisan College");
  });

  it("rejects unknown filter values", () => {
    expect(isCampusTrack("VARSITY")).toBe(true);
    expect(isCampusTrack("alumni")).toBe(false);
    expect(isCampusTrack(undefined)).toBe(false);
  });
});
