import { LogLevel } from "../types";
import { asyncLocalStorage } from "./async-storage.util";

function formatLogMessage(
  logLevel: LogLevel,
  appName: string,
  message: string,
  execution?: { name?: string; time?: number },
  ...optionalParams: any[]
): string {
  const timestamp = new Date().toISOString();
  const traceId = asyncLocalStorage.getStore()?.traceId ?? "N/A";

  const payload = optionalParams.find(param => param && typeof param === "object") ?? null;

  const executionInfo =
    execution?.name && typeof execution?.time === "number"
      ? `${execution.name} ${execution.time}ms`
      : "N/A";

  return `[${timestamp}] [${logLevel.toUpperCase()}] [${appName.toUpperCase()}] [${traceId}] [${message}] [${
    payload ? JSON.stringify(payload) : "N/A"
  }] [${executionInfo}]`;
}

export default formatLogMessage;
