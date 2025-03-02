import { DestinationStream, LoggerOptions as PinoLoggerOptions } from 'pino';
import { LoggerOptions as WinstonLoggerOptions } from 'winston';

export const EventTransportType = {
  KAFKA: 'kafka',
} as const;

export type EventTransportType = (typeof EventTransportType)[keyof typeof EventTransportType];

export interface IKafkaTransportOptions {
  type: EventTransportType;
  brokers: string[];
  topic: string;
  clientId?: string;
}

export type EventTransportOptions = IKafkaTransportOptions;

export type IAnalyticProvider = 'mixpanel';
export type IAnalyticSource = 'messaging' | 'insight' | 'console' | 'interaction-hub' | string;

export type IAnalyticPayload = {
  name: string;
  payload: any
} 

export interface ILoggerBaseOptions {
  event_transport?: EventTransportOptions; 
}

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

type IPinoOptions = ILoggerBaseOptions & {
  type?: LoggerType.PINO;
  options?: PinoLoggerOptions | DestinationStream;
};

type IWinstonOptions = ILoggerBaseOptions & {
  type?: LoggerType.WINSTON;
  options?: WinstonLoggerOptions;
};

export type ILoggerOptions = IPinoOptions | IWinstonOptions;