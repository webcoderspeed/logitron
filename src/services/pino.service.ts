import pino, { Logger } from 'pino';
import { format } from 'date-fns';
import { ILogger, ILoggerOptions } from '../types';
import formatLogMessage from '../utils/format-message.util';
import { APP_NAME } from '../constants';

export class PinoService implements ILogger {
  private readonly logger: Logger;
  private readonly appName: string = APP_NAME

  constructor(options: ILoggerOptions['options']) {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
      },
      base: {
        pid: false,
      },
      timestamp: () =>
        `,"time":"${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")}"`,
      ...options,
    });
    this.appName = options?.appName ?? APP_NAME
  }

  info(message: string, ...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(
      'info',
      this.appName,
      message, undefined,
      ...optionalParams
    );

    this.logger.info(formatedMessage);
  }

  warn(message: string, ...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(
      'warn',
      this.appName,
      message, undefined,
      ...optionalParams
    );
    this.logger.warn(formatedMessage);
  }

  error(message: string, ...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(
      'error',
      this.appName,
      message, undefined,
      ...optionalParams
    );
    this.logger.error(formatedMessage);
  }

  debug(message: string, ...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(
      'debug',
      this.appName,
      message, undefined,
      ...optionalParams
    );
    this.logger.debug(formatedMessage);
  }
}