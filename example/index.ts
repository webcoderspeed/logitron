import express from 'express';
import {
  LoggerType,
  EXECUTION_LOG_CALLER,
  EXECUTION_LOG_START_TIME,
  transports,
  format,
  LoggerService,
  traceMiddleware,
  startServer
} from '../src';

const { colorize, printf, combine, timestamp } = format;

const app = express();

app.use(traceMiddleware)

const logger = new LoggerService({
  type: LoggerType.WINSTON,
  options: {
    level: 'debug',
    transports: [
      new transports.Console({
        format: combine(
          timestamp({
            format: 'YYYY-MM-DDThh:mm:ss',
          }),
          colorize({ all: true }),
          printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`),
        ),
      }),
      new transports.File({
        filename: './logs/api.log',
      }),
    ],
    format: combine(
      timestamp({
        format: 'YYYY-MM-DDThh:mm:ss',
      }),
      printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`),
    ),
  },
});

let count = 0;

app.get('/', async (req, res) => {
  count++;

  const newTime = new Date().getTime();
  logger.info('Inside app route');

  await new Promise(res => setTimeout(res, 1500));

  logger.info('Inside app route after 5s', {
    count,
    [EXECUTION_LOG_START_TIME]: newTime,
    [EXECUTION_LOG_CALLER]: 'timer',
  });

  res.send('Hi');
});

app.post('/', async (req, res) => {
  count++;

  const newTime = new Date().getTime();
  logger.info('Inside app route');

  await new Promise(res => setTimeout(res, 1500));

  logger.info('Inside app route after 5s', {
    count,
    [EXECUTION_LOG_START_TIME]: newTime,
    [EXECUTION_LOG_CALLER]: 'timer',
  });

  res.send('Hi');
});

app.listen(1337, () => logger.info(`Listening on port: 1337`));

startServer('./logs/api.log');