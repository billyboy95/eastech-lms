export function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  return (
    <div>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-navy/60">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-navy/10">
        <div className="h-full rounded-full bg-sea" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
