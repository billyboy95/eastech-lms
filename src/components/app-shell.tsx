import { getSessionUser } from "@/lib/auth";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
