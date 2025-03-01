import { createLogger, transports, format } from 'winston';
import { ILogger, ILoggerOptions } from '../types';
import formatLogMessage from '../utils/format-message.util';

const { combine, timestamp, printf, colorize } = format;

export class WinstonService implements ILogger {
  private readonly logger;

  constructor(options: ILoggerOptions['options']) {
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DDThh:mm:ss',
        }),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
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