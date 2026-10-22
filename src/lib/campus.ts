import { CampusTrack } from "@prisma/client";

export type CampusTrackMeta = {
  value: CampusTrack;
  label: string;
  shortLabel: string;
  blurb: string;
};

export const CAMPUS_TRACKS: CampusTrackMeta[] = [
  {
    value: CampusTrack.SCHOOL,
    label: "EASTC School",
    shortLabel: "School",
    blurb: "Foundations for younger learners across digital literacy and coastal science.",
  },
  {
    value: CampusTrack.ARTISAN_COLLEGE,
    label: "Artisan College",
    shortLabel: "Artisan",
    blurb: "Studio trades — joinery, fabrication, and making with a technocentric workshop.",
  },
  {
    value: CampusTrack.VARSITY,
    label: "Varsity",
    shortLabel: "Varsity",
    blurb: "Degree-track computing, applied science, and coastal entrepreneurship.",
  },
  {
    value: CampusTrack.FOOD_COURT,
    label: "Food Court",
    shortLabel: "Food Court",
    blurb: "Hospitality, kitchen operations, and food safety for EASTC’s dining commons.",
  },
];

export function campusTrackMeta(track: CampusTrack): CampusTrackMeta {
  const match = CAMPUS_TRACKS.find((item) => item.value === track);
  if (!match) {
    throw new Error(`Unknown campus track: ${track}`);
  }
  return match;
}

export function isCampusTrack(value: string | undefined): value is CampusTrack {
  return CAMPUS_TRACKS.some((item) => item.value === value);
}
