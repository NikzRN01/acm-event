export type DetectionState = "idle" | "processing" | "healthy" | "anomaly";

export interface ECGPoint {
  index: number;
  time: number;
  signal: number;
  isAnomaly?: boolean;
}

export interface ECGUploadResult {
  fileName: string;
  fileSize: number;
  data: ECGPoint[];
}
