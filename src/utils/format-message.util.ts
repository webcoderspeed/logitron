import { EXECUTION_LOG_CALLER, EXECUTION_LOG_START_TIME } from "../constants";
import { asyncLocalStorage } from "./async_storage.util";

function formatLogMessage(...optionalParams: any[]) {
  const traceId = asyncLocalStorage.getStore()?.traceId ?? null;

  let restData = [];
  let executionTime: number | null = null;
  let executionCallerName: string | null = null;
  
  for (const item of optionalParams.filter((o) => o)) {
    if (item && typeof item === "object") {
      if (EXECUTION_LOG_START_TIME in item) {
        const currentTime = Date.now();
        executionTime =
          (currentTime - (typeof item[EXECUTION_LOG_START_TIME] === "number"
            ? item[EXECUTION_LOG_START_TIME]
            : 0)) / 1000; // Convert to seconds
        delete item[EXECUTION_LOG_START_TIME];
      }
      if (EXECUTION_LOG_CALLER in item) {
        executionCallerName = item[EXECUTION_LOG_CALLER];
        delete item[EXECUTION_LOG_CALLER];
      }
    }
  
    if (Object?.keys(item)?.length) {
      restData.push(item);
    }
  }
  

  const formattedData = restData
    .filter((r) => r)
    .map((d) => (typeof d === "object" ? JSON.stringify(d) : d))
    .join(" ");

  let logMessage = formattedData;

  if (executionTime !== null) {
    logMessage = `[${
      executionCallerName ? executionCallerName + ": " : ""
    }${executionTime}s]:${logMessage}`;
  }

  if (traceId) {
    logMessage = `[${traceId}]:${logMessage}`;
  }

  return logMessage;
}

export default formatLogMessage;
