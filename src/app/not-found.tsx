import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-navy/10">
      <h1 className="font-display text-3xl text-navy">Page not found</h1>
      <p className="mt-2 text-navy/65">That course or lesson is not in this starter catalog.</p>
      <Link href="/" className="mt-6 inline-block text-sea hover:underline">
        Back to catalog
      </Link>
    </div>
  );
}
