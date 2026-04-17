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
                <Scatter
                  data={anomalyPoints}
                  dataKey="signal"
                  fill="#ef4444"
                  shape={(props: { cx?: number; cy?: number }) => {
                    const { cx, cy } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="#ef4444"
                        stroke="#111827"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              ) : null}
              <Brush dataKey="time" height={20} stroke="#0d9488" travellerWidth={8} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {showAnomalies ? (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Anomaly Points</p>
              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-xs font-medium text-danger">
                {anomalyPoints.length} total
              </span>
            </div>

            {anomalyPoints.length === 0 ? (
              <p className="text-sm text-muted-foreground">No anomaly points detected for the current threshold.</p>
            ) : (
              <div className="max-h-44 overflow-auto rounded-md border border-border/70 bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border/70">
                      <th className="px-3 py-2 font-medium">Index</th>
                      <th className="px-3 py-2 font-medium">Time</th>
                      <th className="px-3 py-2 font-medium">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalyPoints.map((point) => (
                      <tr key={`${point.index}-${point.time}`} className="border-b border-border/40 last:border-b-0">
                        <td className="px-3 py-1.5">{point.index}</td>
                        <td className="px-3 py-1.5">{point.time.toFixed(2)}</td>
                        <td className="px-3 py-1.5 font-medium text-danger">{point.signal.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
