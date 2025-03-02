import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage, TraceIdHandler, tracer } from "../utils";

export function traceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const traceId =
    (req?.headers?.[TraceIdHandler.getTraceIdField()] as string) ??
    (req?.body?.[TraceIdHandler.getTraceIdField()] as string) ??
    (req?.query?.[TraceIdHandler.getTraceIdField()] as string) ??
    uuidv4();
  asyncLocalStorage.run({ traceId }, () => {
    if (true) {
      tracer.startActiveSpan("request-span", (span) => {
        span.setAttribute("traceId", traceId);
        res.on("finish", () => span.end());
        next();
      });
    } else {
      next();
    }
    });
}
