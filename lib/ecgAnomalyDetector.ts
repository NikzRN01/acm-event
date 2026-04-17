import type { ECGPoint } from "@/lib/types";

export interface DetectionResult {
  indices: number[];
  points: ECGPoint[];
  mean: number;
  std: number;
}

export function detectECGAnomalies(
  input: ECGPoint[],
  thresholdMultiplier = 2
): DetectionResult {
  if (input.length === 0) {
    return {
      indices: [],
      points: [],
      mean: 0,
      std: 0
    };
  }

  const mean =
    input.reduce((sum, point) => sum + point.signal, 0) / input.length;

  const variance =
    input.reduce((sum, point) => sum + (point.signal - mean) ** 2, 0) / input.length;

  const std = Math.sqrt(variance);
  const threshold = thresholdMultiplier * std;

  const indices: number[] = [];
  const points = input.map((point, idx) => {
    const isAnomaly = Math.abs(point.signal - mean) > threshold;
    if (isAnomaly) indices.push(idx);
    return {
      ...point,
      isAnomaly
    };
  });

  return {
    indices,
    points,
    mean,
    std
  };
}
