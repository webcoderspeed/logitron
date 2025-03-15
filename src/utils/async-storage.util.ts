import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

export function withTraceId(traceId: string, fn: () => void) {
  asyncLocalStorage.run({ traceId }, fn);
}
