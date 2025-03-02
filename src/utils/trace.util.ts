import { APP_NAME, TRACE_ID } from "../constants";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";
import { trace } from "@opentelemetry/api";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

export class TraceIdHandler {
  private static traceId: string = TRACE_ID;

  static getTraceIdField(): string {
    return TraceIdHandler.traceId;
  }

  static setTraceId(traceId: string): void {
    TraceIdHandler.traceId = traceId;
  }
}



const provider = new NodeTracerProvider({
  sampler: new TraceIdRatioBasedSampler(1.0),
  spanProcessors: [
    new BatchSpanProcessor(new ConsoleSpanExporter()),
    new BatchSpanProcessor(new OTLPTraceExporter({ url: "http://localhost:4317/v1/traces" })),
  ],
});

provider.register();

export const tracer = trace.getTracer(APP_NAME);
