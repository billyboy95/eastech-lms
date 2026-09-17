export type ProgressSnapshot = {
  completed: number;
  total: number;
  percent: number;
};

export function computeProgress(completed: number, total: number): ProgressSnapshot {
  if (completed < 0 || total < 0) {
    throw new Error("Progress counts cannot be negative");
  }
  if (total === 0) {
    return { completed: 0, total: 0, percent: 0 };
  }
  const bounded = Math.min(completed, total);
  return {
    completed: bounded,
    total,
    percent: Math.round((bounded / total) * 100),
  };
}

export function enrollmentStatusFromProgress(percent: number): "ACTIVE" | "COMPLETED" {
  return percent >= 100 ? "COMPLETED" : "ACTIVE";
}
