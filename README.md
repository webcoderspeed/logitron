# nodejs-logitron
[![npm version](https://img.shields.io/npm/v/nodejs-logitron)](https://www.npmjs.com/package/nodejs-logitron)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)
[![TypeScript definitions on DefinitelyTyped](https://img.shields.io/badge/DefinitelyTyped-.d.ts-brightgreen.svg?style=flat)](https://definitelytyped.org)

nodejs-logitron is a powerful logging library built on top of **Winston** and **Pino**, providing structured logging with **trace ID injection per request**. It simplifies debugging in distributed systems by ensuring each log is uniquely traceable without memory leaks or async task issues.

## Features
- **Trace ID injection** for each request, making debugging seamless.
- **Context-aware logging** using `async_hooks` to ensure proper trace ID propagation.
- **Middleware support** for Express to automatically assign trace IDs.
- **Multiple transports** (console, file, external logging services, etc.).
- **Structured logging format** for easy log analysis.
- **No memory leaks** or loss of trace ID even in asynchronous tasks.
- **Extendable & customizable** to fit your logging needs.

---

## Installation

Install `nodejs-logitron` using npm:

```sh
npm install nodejs-logitron
```

---

## Quick Start

```js
import express from 'express';
import {
    LoggerType,
    transports,
    format,
    LoggerService,
    traceMiddleware,
    TraceIdHandler
} from 'nodejs-logitron';

const { colorize, printf, combine } = format;
const app = express();

// Use trace middleware
app.use(traceMiddleware);

// Initialize logger
const logger = new LoggerService({
    type: LoggerType.WINSTON,
    options: {
        appName: 'Test App',
        level: 'debug',
        transports: [
            new transports.Console({
                format: combine(
                    colorize({ all: true }),
                    printf((info) => `${info.message}`),
                ),
            }),
            new transports.File({ filename: './logs/api.log' }),
        ],
        format: combine(printf((info) => `${info.message}`)),
    },
});

let count = 0;

app.get('/', async (req, res) => {
    count++;
    const start = performance.now();
    
    logger.info('Inside app route');
    
    await new Promise((res) => setTimeout(res, 3500));
    
    logger.infoWithExecutionTime(
        'Inside app route after 5s',
        { name: 'GET /', start },
        { count }
    );
    
    res.send('Hello World');
});

app.listen(1337, () => logger.info(`Listening on port: 1337`));
```

---

## Why We Use `async_hooks` for Trace ID Storage
### Problem:
When handling concurrent requests, using global variables or request-scoped storage for trace IDs often leads to **incorrect trace association** or **memory leaks**. Asynchronous operations, such as database queries or background jobs, do not always retain their original execution context.

### Solution:
We use Node.js `async_hooks` to maintain a **continuation-local storage (CLS)** per request. This ensures that **each trace ID remains bound to the originating request** across all async operations.

### How `async_hooks` Works:
- A new **async context** is created for each HTTP request.
- The trace ID is stored in this **context**, ensuring that every log from that request **carries the correct trace ID**.
- Even in async tasks (setTimeout, database calls, etc.), the trace ID is **automatically retained**.

### Express Middleware for Automatic Trace ID Injection
```ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { withTraceId, TraceIdHandler } from 'nodejs-logitron';

export function traceMiddleware(req: Request, _: Response, next: NextFunction) {
    const traceId =
        req.headers[TraceIdHandler.getTraceIdField()]?.toString() ||
        req.body?.[TraceIdHandler.getTraceIdField()] ||
        req.query?.[TraceIdHandler.getTraceIdField()] ||
        uuidv4();

    withTraceId(traceId, () => next());
}
```

Now, every log statement in a request lifecycle will **automatically contain the trace ID**.

---

## Log Output Format

```
[yyyy-mm-dd hh:mm:ss.MS] [log_level] [app_name] [trace_id] [message] [payload] [time_taken_MS]
```

Example Logs:
```sh
[2025-03-15T06:50:30.631Z] [INFO] [TEST APP] [N/A] [Listening on port: 1337] [N/A] [N/A]
[2025-03-15T06:50:35.212Z] [INFO] [TEST APP] [82ebbbe6-6dff-4f59-acc6-b61d23f23c40] [Inside app route] [N/A] [N/A]
[2025-03-15T06:50:38.723Z] [INFO] [TEST APP] [82ebbbe6-6dff-4f59-acc6-b61d23f23c40] [Inside app route after 5s] [{"count":1}] [GET / 3511.33 ms]
```

---

## Contribution
nodejs-logitron is an **open-source project** designed to make logging simple and efficient for developers. We welcome contributions from the community to improve and enhance the library.

### How to Contribute
- Fork the repository
- Create a feature branch (`git checkout -b feature-name`)
- Commit your changes (`git commit -m "Add new feature"`)
- Push your branch (`git push origin feature-name`)
- Open a Pull Request

Help us make debugging and logging **easier for developers worldwide**! 🚀

---

## License
MIT License

---

## Contact & Support
If you have any questions, issues, or feature requests, feel free to open an issue or reach out!

Happy logging! 📜✨

