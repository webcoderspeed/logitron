import express from 'express';
import {
  LoggerType,
  EXECUTION_LOG_CALLER,
  EXECUTION_LOG_START_TIME,
  transports,
  format,
  LoggerService,
  traceMiddleware,
} from '../src';

const { colorize, printf, combine, timestamp } = format;

const app = express();

app.use(traceMiddleware);

const logger = new LoggerService({
  type: LoggerType.WINSTON,
  options: {
    level: 'debug',
    transports: [
      new transports.Console({
        format: combine(
          timestamp({ format: 'YYYY-MM-DDThh:mm:ss' }),
          colorize({ all: true }),
          printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
      }),
      new transports.File({ filename: 'api.log' }),
    ],
    format: combine(
      timestamp({ format: 'YYYY-MM-DDThh:mm:ss' }),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    
  },
});

let count = 0;

const logMemoryUsage = (message: string) => {
  const memoryUsage = process.memoryUsage();
  logger.info(message, {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
  });
};

app.get('/', async (req, res) => {
  count++;
  
  logMemoryUsage('Before processing request');

  const newTime = Date.now();
  logger.info('Inside app route');

  await new Promise((resolve) => setTimeout(resolve, 1500));

  logger.info('Inside app route after delay', {
    count,
    [EXECUTION_LOG_START_TIME]: newTime,
    [EXECUTION_LOG_CALLER]: 'timer',
  });

  logMemoryUsage('After processing request');

  res.send('Hi');
});

app.post('/', async (req, res) => {
  count++;

  logMemoryUsage('Before processing request');

  const newTime = Date.now();
  logger.info('Inside app route');

  await new Promise((resolve) => setTimeout(resolve, 1500));

  logger.info('Inside app route after delay', {
    count,
    [EXECUTION_LOG_START_TIME]: newTime,
    [EXECUTION_LOG_CALLER]: 'timer',
  });

  logMemoryUsage('After processing request');

  res.send('Hi');
});

app.listen(1337, () => {
  logger.debug('Listening on port: 1337');
  logMemoryUsage('Initial memory usage');
});
