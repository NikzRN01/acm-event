import { FiAlertTriangle, FiActivity, FiCheckCircle } from "react-icons/fi";

import { Alert } from "@/components/ui/alert";
import type { DetectionState } from "@/lib/types";

interface AnomalyStatusProps {
  state: DetectionState;
  anomalyCount: number;
}

const STATUS_STYLES: Record<
  DetectionState,
  { title: string; subtitle: string; className: string; icon: JSX.Element }
> = {
  idle: {
    title: "Upload ECG data",
    subtitle: "Upload a CSV and run anomaly detection.",
    className: "border-sky-200/70 bg-sky-500/10 text-sky-700 dark:border-sky-800 dark:text-sky-200",
    icon: <FiActivity className="h-5 w-5" />
  },
  processing: {
    title: "Processing...",
    subtitle: "Applying anomaly heuristic over waveform.",
    className: "border-amber-200/70 bg-amber-500/10 text-amber-700 dark:border-amber-900 dark:text-amber-300",
    icon: <FiActivity className="h-5 w-5 animate-pulse" />
  },
  healthy: {
    title: "Healthy / No anomalies detected",
    subtitle: "The waveform is currently within threshold.",
    className: "border-emerald-200/70 bg-emerald-500/10 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300",
    icon: <FiCheckCircle className="h-5 w-5" />
  },
  anomaly: {
    title: "Anomaly detected",
    subtitle: "One or more signal points crossed threshold.",
    className: "border-rose-200/70 bg-rose-500/10 text-rose-700 dark:border-rose-900 dark:text-rose-300",
    icon: <FiAlertTriangle className="h-5 w-5" />
  }
};

export function AnomalyStatus({ state, anomalyCount }: AnomalyStatusProps) {
  const config = STATUS_STYLES[state];

  return (
    <Alert className={config.className}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <p className="font-semibold">{config.title}</p>
            <p className="text-xs opacity-90">{config.subtitle}</p>
          </div>
        </div>
        {state !== "idle" && state !== "processing" ? (
          <span className="rounded-full bg-card/70 px-3 py-1 text-xs font-medium">
            {anomalyCount} flagged point{anomalyCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>
    </Alert>
  );
}
