import { TRACE_ID } from "../constants";
import { asyncLocalStorage } from "./async-storage.util";

export class TraceIdHandler {
  private static traceIdField: string = TRACE_ID;

  static getTraceIdField(): string {
    return TraceIdHandler.traceIdField;
  }

  static setTraceIdField(traceIdField: string): void {
    TraceIdHandler.traceIdField = traceIdField;
  }

  static getTraceId() {
    const traceId = asyncLocalStorage.getStore()?.traceId ?? null;
    return traceId
  }
}