import type { CampusTrack, Role } from "@prisma/client";
import { Role as RoleEnum } from "@prisma/client";
import { signInAsDemoUser } from "@/app/actions/auth";
import { RoleBadge, TrackBadge } from "@/components/badges";
import { prisma } from "@/lib/db";

export const metadata = { title: "Demo sign in" };

type DemoPersona = {
  id: string;
  displayName: string;
  email: string;
  role: Role;
  campusTrack: CampusTrack;
  bio: string;
};

export default async function LoginPage() {
  const people = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { displayName: "asc" }],
  });
  const educators = people.filter((person) => person.role === RoleEnum.EDUCATOR);
  const students = people.filter((person) => person.role === RoleEnum.STUDENT);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy">Demo sign in</h1>
        <p className="mt-2 max-w-2xl text-navy/70">
          Pick a seeded persona. There are no passwords and no real people — every address uses the
          <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-sm">@eastc.demo</code>
          domain.
        </p>
      </div>
      <PersonaGroup title="Educators" people={educators} />
      <PersonaGroup title="Students" people={students} />
    </div>
  );
}

function PersonaGroup({ title, people }: { title: string; people: DemoPersona[] }) {
  return (
    <section>
      <h2 className="font-display text-xl text-navy">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {people.map((person) => (
          <form
            key={person.id}
            action={signInAsDemoUser}
            className="flex flex-col rounded-2xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <input type="hidden" name="userId" value={person.id} />
            <div className="flex flex-wrap items-center gap-2">
              <RoleBadge role={person.role} />
              <TrackBadge track={person.campusTrack} />
            </div>
            <h3 className="mt-3 font-display text-lg text-navy">{person.displayName}</h3>
            <p className="text-xs text-navy/50">{person.email}</p>
            <p className="mt-2 flex-1 text-sm leading-6 text-navy/70">{person.bio}</p>
            <button
              type="submit"
              className="mt-4 self-start rounded-full bg-navy px-4 py-2 text-sm text-foam hover:bg-sea"
            >
              Continue as {person.displayName.split(" ")[0]}
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
