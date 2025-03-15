import { LogEntry } from "../types";
import fs from "fs";
import readline from "readline";

export async function parseLogFile({
  logFilePath,
  page,
  limit,
  logRegex,
  level,
  traceId,
}: {
  logFilePath: string;
  page: number;
  limit: number;
  level?: string;
  traceId?: string;
  logRegex: RegExp;
}): Promise<{ total: number; data: LogEntry[] }> {
  if (!fs.existsSync(logFilePath)) {
    throw new Error("File not found");
  }

  const stream = fs.createReadStream(logFilePath, "utf-8");
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let logs: LogEntry[] = [];
  let total = 0;
  let start = (page - 1) * limit;
  let end = start + limit;

  for await (const line of rl) {
    const match = line.match(logRegex);
    if (!match) continue;

    const [, timestamp, logLevelRaw, appName, parsedTraceId, message, rawPayload, rawExecution] = match;
    const logLevel = logLevelRaw ? logLevelRaw.toLowerCase() : "unknown";

    if (level && logLevel !== level.toLowerCase()) continue;
    if (traceId && parsedTraceId !== traceId) continue;

    const payload = rawPayload && rawPayload !== "N/A" ? JSON.parse(rawPayload) : "";
    const execution = rawExecution && rawExecution !== "N/A" ? rawExecution : "";

    if (total >= start && total < end) {
      logs.push({
        id: parsedTraceId && parsedTraceId.length > 0 ? parsedTraceId : "N/A",
        timestamp: timestamp!,
        level: logLevel,
        appName: appName!,
        message: message!,
        payload,
        execution,
      });
    }
    total++;
  }

  return { total, data: logs };
}
