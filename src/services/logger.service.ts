import { ILogger, ILoggerOptions, LoggerType } from '../types';
import { getLogger } from '../factory/';

export class LoggerService implements ILogger {
    private logger: ILogger;

    constructor(
        options: ILoggerOptions = {
            type: LoggerType.PINO,
        },
    ) {
        this.logger = getLogger(options);
    }

    info(...optionalParams: any[]): void {
        this.logger.info(...optionalParams);
    }

    warn(...optionalParams: any[]): void {
        this.logger.warn(...optionalParams);
    }

    error(...optionalParams: any[]): void {
        this.logger.error(...optionalParams);
    }

    debug(...optionalParams: any[]): void {
        this.logger.debug(...optionalParams);
    }
}