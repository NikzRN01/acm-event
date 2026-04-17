"use client";

import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ECGPoint } from "@/lib/types";

interface ECGChartProps {
  data: ECGPoint[];
  showAnomalies: boolean;
}

export function ECGChart({ data, showAnomalies }: ECGChartProps) {
  const anomalyPoints = showAnomalies ? data.filter((point) => point.isAnomaly) : [];

  return (
    <Card className="border-teal-200/50 shadow-glow dark:border-teal-900/50">
      <CardHeader>
        <CardTitle>ECG Waveform</CardTitle>
        <CardDescription>
          Time-series view with optional anomaly markers and brush zoom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[380px] w-full md:h-[460px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 22, left: 0, bottom: 18 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                label={{ value: "Time / Sample", position: "insideBottom", offset: -4 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                label={{ value: "Amplitude", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,.25)",
                  background: "hsl(var(--card))"
                }}
                formatter={(value: number, name: string) => [value.toFixed(4), name === "signal" ? "Signal" : name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={450}
              />
              {showAnomalies ? (
                <Scatter data={anomalyPoints} dataKey="signal" fill="#ef4444" shape="circle" />
              ) : null}
              <Brush dataKey="time" height={20} stroke="#0d9488" travellerWidth={8} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
