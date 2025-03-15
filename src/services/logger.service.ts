import { ILogger, ILoggerOptions, LoggerType } from '../types';
import { getLogger } from '../factory/';

export class LoggerService implements ILogger {
    private readonly logger: ILogger;

    constructor(
        options: ILoggerOptions = {
            type: LoggerType.PINO,
        },
    ) {
        this.logger = getLogger(options);
    }
    info(message: string, ...optionalParams: any[]): void {
        this.logger.info(message, ...optionalParams)
    }
    
    warn(message: string, ...optionalParams: any[]): void {
                this.logger.warn(message, ...optionalParams)

    }

    error(message: string, ...optionalParams: any[]): void {
                this.logger.error(message, ...optionalParams)

    }

    debug(message: string, ...optionalParams: any[]): void {
                this.logger.debug(message, ...optionalParams)

    }


    
}