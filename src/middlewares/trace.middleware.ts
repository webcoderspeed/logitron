import { NextFunction, Request, Response } from "express";
import { asyncLocalStorage } from "../..";
import { v4 as uuidv4 } from 'uuid';
import { TRACE_ID } from "../constants";

export function traceMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const traceId =
    (req?.headers?.[TRACE_ID] as string) ??
    (req?.body?.[TRACE_ID] as string) ??
    (req?.query?.[TRACE_ID] as string) ??
    uuidv4();
  asyncLocalStorage.run({ traceId }, () => next());
}
