// import express from 'express';
// import { AsyncLocalStorage } from 'async_hooks';

// const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

// export class Logger {
//     static init(traceId: string, fn: () => void) {
//         asyncLocalStorage.run({ traceId }, fn);
//     }

//     static info(message: string) {
//         const store = asyncLocalStorage.getStore();
//         const traceId = store?.traceId || 'UNKNOWN_TRACE_ID';
//         console.log(`INFO: ${new Date().toISOString()} : ${traceId} : ${message}`);
//     }
// }

// export function logMemoryUsage(label: string) {
//     const memoryUsage = process.memoryUsage();
//     console.log(`🟢 ${label} - Memory Usage:`);
//     console.log(`  RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`);
//     console.log('---------------------------------');
// }

// const app = express();
// app.use(express.json());

// Logger.init('one', async () => {
//     await one();
// });

// Logger.init('two', async () => {
//     await one();
// });

// async function one() {
//     Logger.info('Function one');
//     await new Promise((res) => setTimeout(res, 10000));
//     two();
// }

// function two() {
//     Logger.info('Function two');
//     three();
// }

// function three() {
//     Logger.info('Function three');
// }

// const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";
import pino, { LoggerOptions as PinoOptions } from "pino";
import winston, { LoggerOptions as WinstonOptions } from "winston";
import express from "express";

export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

export function withTraceId(traceId: string, fn: () => void) {
  asyncLocalStorage.run({ traceId }, fn);
}

export function traceMiddleware(req: Request, res: Response, next: NextFunction) {
  const traceId = (req.headers["x-trace-id"] as string) || req.body?.traceId || "UNKNOWN_TRACE_ID";
  asyncLocalStorage.run({ traceId }, () => next());
}

export interface Logger {
  log(message: string): void;
  error(message: string): void;
  debug(message: string): void;
  warn(message: string): void;
}

export class PinoLogger implements Logger {
  private logger;

  constructor(options?: PinoOptions) {
    this.logger = pino(options || { transport: { target: "pino-pretty" } });
  }

  private getTraceId(): string {
    return asyncLocalStorage.getStore()?.traceId || "UNKNOWN_TRACE_ID";
  }

  log(message: string) {
    this.logger.info(`[${this.getTraceId()}] ${message}`);
  }

  error(message: string) {
    this.logger.error(`[${this.getTraceId()}] ${message}`);
  }

  debug(message: string) {
    this.logger.debug(`[${this.getTraceId()}] ${message}`);
  }

  warn(message: string) {
    this.logger.warn(`[${this.getTraceId()}] ${message}`);
  }
}

export class WinstonLogger implements Logger {
  private logger;

  constructor(options?: WinstonOptions) {
    this.logger = winston.createLogger(
      options || {
        level: "info",
        format: winston.format.json(),
        transports: [
          new winston.transports.File({ filename: "logger.log" }),
          new winston.transports.File({ filename: "error.log", level: "error" }),
          new winston.transports.Console({ format: winston.format.simple() }),
        ],
      }
    );
  }

  private getTraceId(): string {
    return asyncLocalStorage.getStore()?.traceId || "UNKNOWN_TRACE_ID";
  }

  log(message: string) {
    this.logger.info(`[${this.getTraceId()}] ${message}`);
  }

  error(message: string) {
    this.logger.error(`[${this.getTraceId()}] ${message}`);
  }

  debug(message: string) {
    this.logger.debug(`[${this.getTraceId()}] ${message}`);
  }

  warn(message: string) {
    this.logger.warn(`[${this.getTraceId()}] ${message}`);
  }
}

export class LoggerFactory {
  static createLogger(
    type: "pino" | "winston", 
    options?: PinoOptions | WinstonOptions
  ): Logger {
    return type === "pino" ? new PinoLogger(options as PinoOptions) : new WinstonLogger(options as WinstonOptions);
  }
}

const app = express();
app.use(express.json());
app.use(traceMiddleware);

const loggerOptions: WinstonOptions = {
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
};

const logger: Logger = LoggerFactory.createLogger("winston", loggerOptions);

app.get("/", async (req, res) => {
  logger.log("Received request at root");

  await new Promise((resolve) => setTimeout(resolve, 10000));

  logger.log("Received request after 10s root");
  res.send("Hello, World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
