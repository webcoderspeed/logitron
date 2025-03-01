import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage, TraceIdHandler } from "../utils";

export function traceMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const traceId =
    (req?.headers?.[TraceIdHandler.getTraceIdField()] as string) ??
    (req?.body?.[TraceIdHandler.getTraceIdField()] as string) ??
    (req?.query?.[TraceIdHandler.getTraceIdField()] as string) ??
    uuidv4();
  asyncLocalStorage.run({ traceId }, () => next());
}
