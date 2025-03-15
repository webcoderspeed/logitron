import { DestinationStream, LoggerOptions as PinoLoggerOptions } from 'pino';
import { LoggerOptions as WinstonLoggerOptions } from 'winston';

export interface ILogger {
  info(message: string, ...optionalParams: any[]): void;
  warn(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  debug(message: string, ...optionalParams: any[]): void;
}

export type LogLevel = keyof ILogger

export enum LoggerType {
  WINSTON = 'winston',
  PINO = 'pino',
}

type IExtraOptions = {
  appName?: string
}

type IPinoOptions = {
  type?: LoggerType.PINO;
  options?: (PinoLoggerOptions | DestinationStream) & IExtraOptions;
};

type IWinstonOptions = {
  type?: LoggerType.WINSTON;
  options?: WinstonLoggerOptions & IExtraOptions;
};

export type ILoggerOptions = IPinoOptions | IWinstonOptions;


export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  appName: string;
  message: string;
  payload: string;
  execution: string;
}