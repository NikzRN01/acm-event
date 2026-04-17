"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiFileText, FiUploadCloud, FiXCircle } from "react-icons/fi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseECGCSV } from "@/lib/ecgParser";
import type { ECGUploadResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FileUploadDropzoneProps {
  onDataParsed: (result: ECGUploadResult) => void;
}

export function FileUploadDropzone({ onDataParsed }: FileUploadDropzoneProps) {
  const [status, setStatus] = useState<"ready" | "uploaded" | "invalid">("ready");
  const [message, setMessage] = useState("Drop a CSV file here or click to browse.");
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const content = await file.text();
        const parsed = parseECGCSV(content);

        onDataParsed({
          fileName: file.name,
          fileSize: file.size,
          data: parsed
        });

        setFileMeta({ name: file.name, size: file.size });
        setStatus("uploaded");
        setMessage("CSV uploaded and parsed successfully.");
      } catch (error) {
        setFileMeta({ name: file.name, size: file.size });
        setStatus("invalid");
        setMessage(error instanceof Error ? error.message : "Invalid CSV file.");
      }
    },
    [onDataParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"]
    }
  });

  return (
    <Card className="border-sky-200/60 shadow-glow dark:border-sky-900/60">
      <CardHeader>
        <CardTitle>Upload & Controls</CardTitle>
        <CardDescription>
          CSV must include time/timestamp and signal/value columns, or at least two numeric columns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "group cursor-pointer rounded-xl border-2 border-dashed p-6 transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/30 hover:border-accent hover:bg-accent/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <FiUploadCloud className="h-8 w-8 text-primary transition-transform group-hover:scale-105" />
            <p className="font-medium">{isDragActive ? "Drop ECG CSV here" : "Drag & drop ECG CSV"}</p>
            <p className="text-sm text-muted-foreground">or click to upload</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-sm">
            {status === "uploaded" ? (
              <FiFileText className="h-4 w-4 text-success" />
            ) : status === "invalid" ? (
              <FiXCircle className="h-4 w-4 text-danger" />
            ) : (
              <FiFileText className="h-4 w-4 text-primary" />
            )}
            <span className="font-medium">Status:</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                status === "uploaded" && "bg-success/15 text-success",
                status === "invalid" && "bg-danger/15 text-danger",
                status === "ready" && "bg-primary/15 text-primary"
              )}
            >
              {status === "ready" ? "Ready" : status === "uploaded" ? "Uploaded" : "Invalid CSV"}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          {fileMeta ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {fileMeta.name} ({(fileMeta.size / 1024).toFixed(1)} KB)
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
