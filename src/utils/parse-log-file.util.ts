import { time } from "console";
import { LogEntry } from "../types";
import fs from "fs";
import readline from "readline";

type SearchParams = {
  logFilePath: string;
  page: number;
  limit: number;
  logRegex: RegExp;
  level?: string;
  traceId?: string;
  appName?: string;
  message?: string;
  execution?: string;
  searchPayload?: string;
};

export async function parseLogFile(params: SearchParams): Promise<{ total: number; data: LogEntry[] }> {
  const { logFilePath, page, limit, logRegex, level, traceId, appName, message, execution, searchPayload } = params;

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

    const [, timestamp, logLevelRaw, parsedAppName, parsedTraceId, parsedMessage, rawPayload, rawExecution] = match;
    const logLevel = logLevelRaw ? logLevelRaw.toLowerCase() : "unknown";

    const payload = rawPayload && rawPayload !== "N/A" ? JSON.parse(rawPayload) : "";
    const executionTime = rawExecution && rawExecution !== "N/A" ? rawExecution : "";

    if (level && logLevel !== level.toLowerCase()) continue;
    if (traceId && parsedTraceId !== traceId) continue;
    if (appName && parsedAppName?.toLowerCase() !== appName.toLowerCase()) continue;
    if (message && !parsedMessage?.toLowerCase().includes(message.toLowerCase())) continue;
    if (execution && executionTime !== execution) continue;
    if (searchPayload && rawPayload !== "N/A" && !JSON.stringify(payload).toLowerCase().includes(searchPayload.toLowerCase())) continue;

    if (total >= start && total < end) {
      logs.push({
        id: parsedTraceId && parsedTraceId.length > 0 ? parsedTraceId : "N/A",
        timestamp: timestamp!,
        level: logLevel,
        appName: parsedAppName!,
        message: parsedMessage!,
        payload,
        execution: executionTime,
      });
    }
    total++;
  }

  return { total, data: logs };
}
