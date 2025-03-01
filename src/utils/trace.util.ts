import { TRACE_ID } from "../constants";

export class TraceIdHandler {
  private static traceId: string = TRACE_ID;

  static getTraceIdField(): string {
    return TraceIdHandler.traceId;
  }

  static setTraceId(traceId: string): void {
    TraceIdHandler.traceId = traceId;
  }
}