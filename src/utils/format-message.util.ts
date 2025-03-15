import { EXECUTION_LOG_CALLER, EXECUTION_LOG_START_TIME } from "../constants";
import { asyncLocalStorage } from "./async_storage.util";

function formatLogMessage(...optionalParams: any[]): string {
  const traceId = asyncLocalStorage.getStore()?.traceId ?? null;

  let executionTime: number | null = null;
  let executionCallerName: string | null = null;
  const restData: string[] = [];

  for (const item of optionalParams) {
    if (!item) continue; // Skip falsy values directly

    if (typeof item === "object") {
      if (EXECUTION_LOG_START_TIME in item) {
        executionTime = (Date.now() - Number(item[EXECUTION_LOG_START_TIME] || 0)) / 1000;
        delete item[EXECUTION_LOG_START_TIME];
      }
      if (EXECUTION_LOG_CALLER in item) {
        executionCallerName = item[EXECUTION_LOG_CALLER];
        delete item[EXECUTION_LOG_CALLER];
      }

      // Add to restData only if object still has properties
      if (Object.keys(item).length) {
        restData.push(JSON.stringify(item));
      }
    } else {
      restData.push(String(item)); // Ensure all values are strings
    }
  }

  // Construct log message efficiently
  let logMessage = restData.join(" ");
  if (executionTime !== null) {
    logMessage = `[${executionCallerName ? executionCallerName + ":" : ""}${executionTime}s]:${logMessage}`;
  }
  if (traceId) {
    logMessage = `[${traceId}]:${logMessage}`;
  }

  return logMessage;
}

export default formatLogMessage;
