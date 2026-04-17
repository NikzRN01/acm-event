import { z } from "zod";

import type { ECGPoint } from "@/lib/types";

const rowSchema = z.object({
  time: z.number().finite(),
  signal: z.number().finite()
});

const timeRegex = /^(time|timestamp|sample|index|t)$/i;
const signalRegex = /^(signal|value|amplitude|voltage|ecg)$/i;

function detectDelimiter(line: string) {
  if (line.includes(";")) return ";";
  if (line.includes("\t")) return "\t";
  return ",";
}

function toNumber(value: string) {
  const num = Number(value.trim());
  return Number.isFinite(num) ? num : NaN;
}

export function parseECGCSV(csvText: string): ECGPoint[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("CSV is empty.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const firstTokens = lines[0].split(delimiter).map((token) => token.trim());

  if (firstTokens.length < 2) {
    throw new Error("CSV needs at least two columns.");
  }

  let hasHeader = false;
  let timeIdx = 0;
  let signalIdx = 1;

  const headerTimeIdx = firstTokens.findIndex((token) => timeRegex.test(token));
  const headerSignalIdx = firstTokens.findIndex((token) => signalRegex.test(token));

  if (headerTimeIdx !== -1 && headerSignalIdx !== -1) {
    hasHeader = true;
    timeIdx = headerTimeIdx;
    signalIdx = headerSignalIdx;
  }

  const startIdx = hasHeader ? 1 : 0;
  const points: ECGPoint[] = [];

  for (let i = startIdx; i < lines.length; i += 1) {
    const raw = lines[i].split(delimiter).map((token) => token.trim());

    if (raw.length < 2) continue;

    const parsedSignal = toNumber(raw[signalIdx] ?? raw[1]);
    const parsedTime = toNumber(raw[timeIdx] ?? raw[0]);

    if (!Number.isFinite(parsedSignal)) {
      continue;
    }

    const result = rowSchema.safeParse({
      time: Number.isFinite(parsedTime) ? parsedTime : points.length,
      signal: parsedSignal
    });

    if (!result.success) continue;

    points.push({
      index: points.length,
      time: result.data.time,
      signal: result.data.signal
    });
  }

  if (points.length < 10) {
    throw new Error("CSV does not contain enough valid ECG rows.");
  }

  return points;
}
