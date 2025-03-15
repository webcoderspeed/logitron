/** @format */

import { createLogger, transports, format, Logger } from 'winston';
import { ILogger, ILoggerOptions } from '../types';
import formatLogMessage from '../utils/format-message.util';
import { APP_NAME } from '../constants';

const { combine, timestamp, printf, colorize } = format;

export class WinstonService implements ILogger {
	private readonly logger: Logger;
	private readonly appName: string = APP_NAME;

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
		this.appName = options?.appName ?? APP_NAME;
	}

	infoWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logWithExecutionTime('info', message, execution, ...optionalParams);
	}
	warnWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logWithExecutionTime('warn', message, execution, ...optionalParams);
	}
	errorWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logWithExecutionTime('error', message, execution, ...optionalParams);
	}
	debugWithExecutionTime(message: string, execution: { name: string; start: number }, ...optionalParams: any[]): void {
		this.logWithExecutionTime('debug', message, execution, ...optionalParams);
	}

	info(message: string, ...optionalParams: any[]): void {
		const formatedMessage = formatLogMessage('info', this.appName, message, undefined, ...optionalParams);

		this.logger.info(formatedMessage);
	}

	warn(message: string, ...optionalParams: any[]): void {
		const formatedMessage = formatLogMessage('warn', this.appName, message, undefined, ...optionalParams);
		this.logger.warn(formatedMessage);
	}

	error(message: string, ...optionalParams: any[]): void {
		const formatedMessage = formatLogMessage('error', this.appName, message, undefined, ...optionalParams);
		this.logger.error(formatedMessage);
	}

	debug(message: string, ...optionalParams: any[]): void {
		const formatedMessage = formatLogMessage('debug', this.appName, message, undefined, ...optionalParams);
		this.logger.debug(formatedMessage);
	}

	private logWithExecutionTime(
		level: 'info' | 'warn' | 'error' | 'debug',
		message: string,
		execution: { name: string; start: number },
		...optionalParams: any[]
	): void {
		const executionTime = (performance.now() - execution.start).toFixed(2);
		const formatedMessage = formatLogMessage(
			level,
			this.appName,
			message,
			{
				name: execution?.name,
				time: Number(executionTime),
			},
			...optionalParams,
		);
		this.logger[level](formatedMessage);
	}
}
