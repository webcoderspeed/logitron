import pino, { Logger } from 'pino';
import { format } from 'date-fns';
import { ILogger, ILoggerOptions } from '../types';
import formatLogMessage from '../utils/format-message.util';

export class PinoService implements ILogger {
  private logger: Logger;

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
  }

  info(...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(...optionalParams);
    this.logger.info(formatedMessage);
  }

  warn(...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(...optionalParams);
    this.logger.warn(formatedMessage);
  }

  error(...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(...optionalParams);
    this.logger.error(formatedMessage);
  }

  debug(...optionalParams: any[]): void {
    const formatedMessage = formatLogMessage(...optionalParams);
    this.logger.debug(formatedMessage);
  }
}