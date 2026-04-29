import { EcgPoint, TamvcrumLog } from "@/types/tamv";

function mapEmotionToPattern(log: TamvcrumLog): string {
  const state = log.emotional_state ?? {};
  const label = (state.label ?? state.state ?? "").toString().toLowerCase();

  if (!label) {
    if (log.ecg_rhythm < 50) return "Foco Profundo";
    if (log.ecg_rhythm > 85) return "Saturación";
    return "Estable";
  }

  if (label.includes("focus") || label.includes("deep")) return "Foco Profundo";
  if (label.includes("stress") || label.includes("overload") || label.includes("saturation")) return "Saturación";
  return "Estable";
}

export function aggregateLogsToEcgPoints(logs: TamvcrumLog[], bucketMinutes = 60): EcgPoint[] {
  const sorted = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const buckets = new Map<string, TamvcrumLog[]>();

  for (const log of sorted) {
    const date = new Date(log.created_at);
    const minuteBucket = Math.floor(date.getMinutes() / bucketMinutes) * bucketMinutes;
    const bucketKey = `${String(date.getHours()).padStart(2, "0")}:${String(minuteBucket).padStart(2, "0")}`;

    if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
    buckets.get(bucketKey)?.push(log);
  }

  const points: EcgPoint[] = [];
  for (const [time, bucketLogs] of buckets.entries()) {
    const avg = bucketLogs.reduce((sum, row) => sum + (row.ecg_rhythm || 0), 0) / Math.max(bucketLogs.length, 1);
    const patterns = bucketLogs.map(mapEmotionToPattern);
    const pattern = patterns.sort((a, b) => patterns.filter((x) => x === b).length - patterns.filter((x) => x === a).length)[0] ?? "Estable";
    points.push({ time, rhythm: Math.round(avg), pattern });
  }

  return points.sort((a, b) => (a.time < b.time ? -1 : 1));
}
