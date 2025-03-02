import { IAnalyticPayload, IAnalyticProvider, IAnalyticSource, ILogger, ILoggerOptions, LoggerType } from '../types';
import { getLogger } from '../factory/';
import { KafkaService } from './kafka.service';

export class LoggerService implements ILogger {
    private readonly logger: ILogger;
    private readonly eventTransport?: KafkaService

    constructor(
        options: ILoggerOptions = {
            type: LoggerType.PINO,
        },
    ) {
        this.logger = getLogger(options);

        if(options.event_transport) {
            this.eventTransport =  new KafkaService(options.event_transport)
            this.eventTransport.connect();
        }
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

    logAndSendEventToAnalyticHub(
        level: keyof ILogger,
        event_transport_value: {
            provider: IAnalyticProvider;
            source: IAnalyticSource;
            event: IAnalyticPayload
          },
        ...optionalParams: any[]
      ): void {
          this.logger[level]({...optionalParams, ...event_transport_value});
          this.eventTransport?.produce(event_transport_value);
      }
}