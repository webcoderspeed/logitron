import { TRACE_ID } from "../constants";
import { asyncLocalStorage } from "./async_storage.util";

export class TraceIdHandler {
  private static traceId: string = TRACE_ID;

  static getTraceIdField(): string {
    return TraceIdHandler.traceId;
  }

  static setTraceId(traceId: string): void {
    TraceIdHandler.traceId = traceId;
  }

  static getTraceId() {
    const traceId = asyncLocalStorage.getStore()?.traceId ?? null;
    return traceId
  }
}