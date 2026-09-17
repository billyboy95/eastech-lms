"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-navy/10">
      <h1 className="font-display text-3xl text-navy">Something broke</h1>
      <p className="mt-2 text-navy/65">{error.message || "The demo app hit an unexpected error."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-navy px-4 py-2 text-sm text-foam hover:bg-sea"
      >
        Try again
      </button>
    </div>
  );
}
