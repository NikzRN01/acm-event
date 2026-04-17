"use client";

import { useMemo } from "react";

import { detectECGAnomalies } from "@/lib/ecgAnomalyDetector";
import type { ECGPoint } from "@/lib/types";

export function useECGAnomalies(data: ECGPoint[], enabled: boolean) {
  return useMemo(() => {
    if (!enabled || data.length === 0) {
      return {
        anomalyIndices: [] as number[],
        points: data
      };
    }

    const result = detectECGAnomalies(data);
    return {
      anomalyIndices: result.indices,
      points: result.points
    };
  }, [data, enabled]);
}
