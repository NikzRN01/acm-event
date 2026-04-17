"use client";

import { useMemo, useState } from "react";

import { AnomalyStatus } from "@/components/AnomalyStatus";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ECGChart } from "@/components/ECGChart";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FlickeringGridDemo } from "@/components/ui/demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { detectECGAnomalies } from "@/lib/ecgAnomalyDetector";
import { useECGAnomalies } from "@/lib/useECGAnomalies";
import type { DetectionState, ECGPoint, ECGUploadResult } from "@/lib/types";

export default function HomePage() {
  const [rawData, setRawData] = useState<ECGPoint[]>([]);
  const [detectionState, setDetectionState] = useState<DetectionState>("idle");
  const [detectionEnabled, setDetectionEnabled] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const { anomalyIndices, points } = useECGAnomalies(rawData, detectionEnabled);

  const chartData = useMemo(() => {
    if (!detectionEnabled) {
      return rawData.map((point) => ({ ...point, isAnomaly: false }));
    }
    return points;
  }, [detectionEnabled, points, rawData]);

  function handleDataParsed(result: ECGUploadResult) {
    setRawData(result.data);
    setFileName(result.fileName);
    setDetectionEnabled(false);
    setDetectionState("idle");
  }

  function handleReset() {
    setRawData([]);
    setDetectionEnabled(false);
    setDetectionState("idle");
    setFileName("");
  }

  async function handleDetectAnomalies() {
    if (rawData.length === 0) {
      setDetectionState("idle");
      return;
    }

    setDetectionState("processing");
    setDetectionEnabled(false);

    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const result = detectECGAnomalies(rawData);
    setDetectionEnabled(true);
    setDetectionState(result.indices.length > 0 ? "anomaly" : "healthy");
  }

  return (
    <DashboardLayout>
      <div className="relative isolate overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
          <FlickeringGridDemo backgroundOnly />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6">
          <Card className="border-sky-200/60 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-teal-500/10 dark:border-sky-900/50">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="font-display text-2xl md:text-3xl">ECG Anomaly Detection Dashboard</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Upload an ECG CSV and visualize anomalies on the waveform.
                </CardDescription>
              </div>
              <ThemeToggle />
            </CardHeader>
          </Card>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <FileUploadDropzone onDataParsed={handleDataParsed} />
            </div>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detection Controls</CardTitle>
                <CardDescription>
                  Run simulated anomaly detection using a mean/std threshold heuristic.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleDetectAnomalies}
                    disabled={rawData.length === 0 || detectionState === "processing"}
                  >
                    {detectionState === "processing" ? "Processing..." : "Detect Anomalies"}
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={rawData.length === 0}>
                    Reset
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  File: <span className="font-medium text-foreground">{fileName || "None"}</span>
                </p>
                <AnomalyStatus state={detectionState} anomalyCount={anomalyIndices.length} />
              </CardContent>
            </Card>
          </section>

          <section className="animate-fade-in-up">
            <ECGChart data={chartData} showAnomalies={detectionEnabled} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
