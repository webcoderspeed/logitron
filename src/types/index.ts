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