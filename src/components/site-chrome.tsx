import Image from "next/image";
import Link from "next/link";
import { signOutDemoUser } from "@/app/actions/auth";
import { RoleBadge } from "@/components/badges";
import type { SessionUser } from "@/lib/roles";
import { isEducator } from "@/lib/roles";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  return (
    <header className="border-b border-white/10 bg-navy text-foam">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/eastc-mark.svg" alt="EASTC" width={36} height={36} className="h-9 w-9" />
          <span>
            <span className="block font-display text-lg leading-none tracking-wide">EASTC LMS</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-foam/70">
              East Sea Technocentric
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link className="hover:text-gold" href="/">
            Catalog
          </Link>
          {user && isEducator(user.role) ? (
            <Link className="hover:text-gold" href="/studio">
              Studio
            </Link>
          ) : (
            <Link className="hover:text-gold" href="/dashboard">
              Dashboard
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 sm:flex">
                <RoleBadge role={user.role} />
                <span className="text-foam/80">{user.displayName}</span>
              </span>
              <form action={signOutDemoUser}>
                <button
                  type="submit"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs hover:border-gold hover:text-gold"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold px-3 py-1 text-xs font-medium text-navy hover:bg-gold/90"
            >
              Demo sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-navy/10 bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-navy/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>EASTC Learning Model · school, artisan college, varsity, food court.</p>
        <p>Demo data only — no real student records.</p>
      </div>
    </footer>
  );
}
