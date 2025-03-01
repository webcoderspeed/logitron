import { DestinationStream, LoggerOptions as PinoLoggerOptions } from 'pino';
import { LoggerOptions as WinstonLoggerOptions } from 'winston';

export interface ILogger {
  info(optionalParams?: any[]): void;
  warn(optionalParams?: any[]): void;
  error(optionalParams?: any[]): void;
  debug(optionalParams?: any[]): void;
}

export enum LoggerType {
  WINSTON = 'winston',
  PINO = 'pino',
}

type IPinoOptions = {
  type?: LoggerType.PINO;
  options?: PinoLoggerOptions | DestinationStream;
};

type IWinstonOptions = {
  type?: LoggerType.WINSTON;
  options?: WinstonLoggerOptions;
};

export type ILoggerOptions = IPinoOptions | IWinstonOptions;