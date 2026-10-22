import { CampusTrack, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

type SeedLesson = {
  slug: string;
  title: string;
  summary: string;
  durationMin: number;
  content: string;
};

type SeedCourse = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  campusTrack: CampusTrack;
  educatorEmail: string;
  lessons: SeedLesson[];
};

const educators = [
  {
    email: "priya.sharma@eastc.demo",
    displayName: "Priya Sharma",
    role: Role.EDUCATOR,
    campusTrack: CampusTrack.SCHOOL,
    bio: "School-track educator for digital foundations and coastal science literacy.",
  },
  {
    email: "amara.nkrumah@eastc.demo",
    displayName: "Amara Nkrumah",
    role: Role.EDUCATOR,
    campusTrack: CampusTrack.ARTISAN_COLLEGE,
    bio: "Master artisan in the joinery studio. Teaches making, measurement, and workshop safety.",
  },
  {
    email: "kofi.mensah@eastc.demo",
    displayName: "Kofi Mensah",
    role: Role.EDUCATOR,
    campusTrack: CampusTrack.VARSITY,
    bio: "Varsity computing lecturer. Builds applied labs around data, systems, and coastal enterprise.",
  },
  {
    email: "adaeze.okafor@eastc.demo",
    displayName: "Chef Adaeze Okafor",
    role: Role.EDUCATOR,
    campusTrack: CampusTrack.FOOD_COURT,
    bio: "Food Court culinary lead. Covers kitchen operations, allergens, and service flow.",
  },
] as const;

const students = [
  {
    email: "nia.okonkwo@eastc.demo",
    displayName: "Nia Okonkwo",
    role: Role.STUDENT,
    campusTrack: CampusTrack.SCHOOL,
    bio: "School-track learner exploring digital tools and coastal science.",
  },
  {
    email: "samir.patel@eastc.demo",
    displayName: "Samir Patel",
    role: Role.STUDENT,
    campusTrack: CampusTrack.ARTISAN_COLLEGE,
    bio: "Artisan College apprentice focused on joinery and workshop practice.",
  },
  {
    email: "jordan.lee@eastc.demo",
    displayName: "Jordan Lee",
    role: Role.STUDENT,
    campusTrack: CampusTrack.VARSITY,
    bio: "Varsity student in applied computing and entrepreneurship labs.",
  },
  {
    email: "lila.chen@eastc.demo",
    displayName: "Lila Chen",
    role: Role.STUDENT,
    campusTrack: CampusTrack.FOOD_COURT,
    bio: "Food Court trainee learning kitchen operations and guest service.",
  },
] as const;

const courses: SeedCourse[] = [
  {
    slug: "digital-foundations",
    title: "Digital Foundations",
    summary: "Core computing habits for EASTC School: files, networks, and responsible use.",
    description:
      "A first-year school-track course covering how EASTC learners organise work, stay safe online, and use campus systems without treating any real student records.",
    campusTrack: CampusTrack.SCHOOL,
    educatorEmail: "priya.sharma@eastc.demo",
    lessons: [
      {
        slug: "campus-accounts",
        title: "Campus accounts and folders",
        summary: "How EASTC organises files across School devices.",
        durationMin: 18,
        content:
          "Create a class folder, name files with dates, and keep personal data out of shared drives. Demo accounts never use real student records.",
      },
      {
        slug: "networks-and-safety",
        title: "Networks and safety",
        summary: "Public Wi-Fi, phishing tells, and what to report.",
        durationMin: 22,
        content:
          "EASTC networks are shared. Lock screens, ignore unexpected password requests, and report odd links to an educator — not by forwarding them.",
      },
      {
        slug: "responsible-collaboration",
        title: "Responsible collaboration",
        summary: "Comments, versions, and citing a classmate’s idea.",
        durationMin: 20,
        content:
          "Use comments instead of silent overwrites. Credit collaborators. If you remix a workshop template, note what you changed.",
      },
    ],
  },
  {
    slug: "joinery-studio-i",
    title: "Joinery Studio I",
    summary: "Measure twice, cut once — Artisan College woodworking fundamentals.",
    description:
      "Studio practice for Artisan College: square stock, mortise-and-tenon basics, and workshop safety around EASTC’s making floors.",
    campusTrack: CampusTrack.ARTISAN_COLLEGE,
    educatorEmail: "amara.nkrumah@eastc.demo",
    lessons: [
      {
        slug: "shop-safety",
        title: "Shop safety walkthrough",
        summary: "PPE, dust, and when a machine is not yours to start.",
        durationMin: 25,
        content:
          "Tie hair, wear closed shoes, and never bypass a guard. If you did not set up a tool, ask the floor lead before powering it.",
      },
      {
        slug: "layout-and-measurement",
        title: "Layout and measurement",
        summary: "Squares, marking knives, and reading a rod.",
        durationMin: 30,
        content:
          "A story stick beats a crowded tape. Mark from a reference face, and leave the line until the joint closes.",
      },
      {
        slug: "mortise-and-tenon",
        title: "Mortise and tenon",
        summary: "A first structural joint for stools and frames.",
        durationMin: 40,
        content:
          "Cut the mortise first. Fit the tenon to the hole you actually chopped, not the drawing. Dry-fit before glue.",
      },
    ],
  },
  {
    slug: "applied-computing-101",
    title: "Applied Computing 101",
    summary: "Varsity intro to data, APIs, and small systems that stay honest.",
    description:
      "A varsity primer: model a problem, store it cleanly, and expose a small interface. The EASTC LMS itself is the running example.",
    campusTrack: CampusTrack.VARSITY,
    educatorEmail: "kofi.mensah@eastc.demo",
    lessons: [
      {
        slug: "model-the-problem",
        title: "Model the problem",
        summary: "Users, courses, lessons, enrollments — keep roles explicit.",
        durationMin: 28,
        content:
          "Start with nouns the campus already uses. A student enrolls; an educator authors. Do not mix PII into seeds. Fake @eastc.demo identities are enough.",
      },
      {
        slug: "store-it-cleanly",
        title: "Store it cleanly",
        summary: "Keys, uniqueness, and why progress is not a vibe.",
        durationMin: 32,
        content:
          "Progress is completed lessons over published lessons. Unique (user, course) pairs stop double enrollments. Cascade deletes when a course is retired.",
      },
      {
        slug: "small-interfaces",
        title: "Small interfaces",
        summary: "Pages and actions instead of a dozen microservices.",
        durationMin: 26,
        content:
          "Catalog, course, lesson, dashboard, studio. Server actions for enroll and complete. Swap SQLite for Postgres when you leave the laptop.",
      },
    ],
  },
  {
    slug: "kitchen-operations",
    title: "Kitchen Operations & Food Safety",
    summary: "Food Court service flow, allergens, and a calm pass.",
    description:
      "Hospitality training for EASTC’s Food Court: mise en place, allergen flags, and how tickets move from expo to table without chaos.",
    campusTrack: CampusTrack.FOOD_COURT,
    educatorEmail: "adaeze.okafor@eastc.demo",
    lessons: [
      {
        slug: "mise-en-place",
        title: "Mise en place",
        summary: "Stations that survive a lunch rush.",
        durationMin: 24,
        content:
          "Label, date, and face everything. A labelled squeeze bottle beats a mystery cambro when the queue hits the atrium.",
      },
      {
        slug: "allergens-and-flags",
        title: "Allergens and flags",
        summary: "How EASTC Food Court marks the big eight plus sesame.",
        durationMin: 20,
        content:
          "Never guess. If a ticket is flagged, remake on a clean board. Demo recipes in this LMS do not describe real guests.",
      },
      {
        slug: "expo-and-handoff",
        title: "Expo and handoff",
        summary: "Call, garnish, and send — then reset.",
        durationMin: 22,
        content:
          "Expo is a conversation. Repeat the table, check the flag, wipe the rim, and only then send. Reset before the next ticket lands.",
      },
    ],
  },
  {
    slug: "coastal-enterprise-lab",
    title: "Coastal Enterprise Lab",
    summary: "Turn an EASTC idea into a one-page offer, cost, and channel.",
    description:
      "A cross-campus varsity lab: pick a coastal or campus service, price it, and pitch it. Built for learners who will later plug work into the full LMS.",
    campusTrack: CampusTrack.VARSITY,
    educatorEmail: "kofi.mensah@eastc.demo",
    lessons: [
      {
        slug: "offer-on-one-page",
        title: "Offer on one page",
        summary: "Who it is for, what changes, and what it costs.",
        durationMin: 30,
        content:
          "Write the buyer, the job-to-be-done, and the first deliverable. If you cannot say it in a paragraph, you do not have an offer yet.",
      },
      {
        slug: "cost-the-work",
        title: "Cost the work",
        summary: "Materials, time, and the quiet overhead of campus space.",
        durationMin: 28,
        content:
          "List ingredients or components, hours, and a slot fee for studio or kitchen time. Margin is what remains after you pay EASTC back for the room.",
      },
      {
        slug: "choose-a-channel",
        title: "Choose a channel",
        summary: "Food Court special, artisan market, or varsity demo day.",
        durationMin: 24,
        content:
          "Pick one channel and a date. A market stall with three SKUs beats a twelve-page plan that never leaves the lab.",
      },
    ],
  },
];

const enrollments = [
  {
    studentEmail: "nia.okonkwo@eastc.demo",
    courseSlug: "digital-foundations",
    completedLessonSlugs: ["campus-accounts", "networks-and-safety"],
  },
  {
    studentEmail: "samir.patel@eastc.demo",
    courseSlug: "joinery-studio-i",
    completedLessonSlugs: ["shop-safety"],
  },
  {
    studentEmail: "jordan.lee@eastc.demo",
    courseSlug: "applied-computing-101",
    completedLessonSlugs: ["model-the-problem"],
  },
  {
    studentEmail: "jordan.lee@eastc.demo",
    courseSlug: "coastal-enterprise-lab",
    completedLessonSlugs: [] as string[],
  },
  {
    studentEmail: "lila.chen@eastc.demo",
    courseSlug: "kitchen-operations",
    completedLessonSlugs: ["mise-en-place", "allergens-and-flags", "expo-and-handoff"],
  },
];

async function main() {
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  for (const person of [...educators, ...students]) {
    await prisma.user.create({ data: { ...person } });
  }

  for (const course of courses) {
    const educator = await prisma.user.findUniqueOrThrow({
      where: { email: course.educatorEmail },
    });
    const created = await prisma.course.create({
      data: {
        slug: course.slug,
        title: course.title,
        summary: course.summary,
        description: course.description,
        campusTrack: course.campusTrack,
        educatorId: educator.id,
      },
    });
    for (const [index, lesson] of course.lessons.entries()) {
      await prisma.lesson.create({
        data: {
          ...lesson,
          order: index + 1,
          courseId: created.id,
        },
      });
    }
  }

  for (const row of enrollments) {
    const student = await prisma.user.findUniqueOrThrow({
      where: { email: row.studentEmail },
    });
    const course = await prisma.course.findUniqueOrThrow({
      where: { slug: row.courseSlug },
      include: { lessons: true },
    });
    const complete = row.completedLessonSlugs.length === course.lessons.length;
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        status: complete ? "COMPLETED" : "ACTIVE",
      },
    });
    for (const slug of row.completedLessonSlugs) {
      const lesson = course.lessons.find((item) => item.slug === slug);
      if (!lesson) {
        throw new Error(`Missing lesson ${slug} on ${course.slug}`);
      }
      await prisma.lessonProgress.create({
        data: { userId: student.id, lessonId: lesson.id },
      });
    }
  }

  const [userCount, courseCount, lessonCount, enrollmentCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.enrollment.count(),
  ]);
  console.log(
    `Seeded ${userCount} demo people, ${courseCount} courses, ${lessonCount} lessons, ${enrollmentCount} enrollments.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
