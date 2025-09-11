"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  timestamp: string;
  message?: string;
  type?: "result" | "error";
  result?: any;
  error?: string;
}

interface LogViewerProps {
  isActive: boolean;
  eventSource: EventSource | null;
  onResult?: (result: any) => void;
  onError?: (error: string) => void;
}

export function LogViewer({
  isActive,
  eventSource,
  onResult,
  onError,
}: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!eventSource) {
      return;
    }

    // Clear previous logs when starting a new session
    if (isActive) {
      setLogs([]);
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const data: LogEntry = JSON.parse(event.data);
        setLogs((prev) => [...prev, data]);

        if (data.type === "result" && onResult) {
          onResult(data.result);
        } else if (data.type === "error" && onError) {
          onError(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.addEventListener("message", handleMessage);

    return () => {
      eventSource.removeEventListener("message", handleMessage);
    };
  }, [eventSource, isActive, onResult, onError]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-3">
        <h3 className="font-semibold">Server Logs</h3>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {logs.length === 0 && !isActive && (
            <div className="text-sm text-muted-foreground italic">
              No logs yet. Submit a job to see real-time logs.
            </div>
          )}
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">
              <div className="text-xs text-muted-foreground mb-1">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
              <div
                className={`p-2 rounded text-xs ${
                  log.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : log.type === "result"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-gray-50 text-gray-800 border border-gray-200"
                }`}
              >
                {log.message ||
                  (log.type === "result"
                    ? JSON.stringify(log.result, null, 2)
                    : log.error)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
