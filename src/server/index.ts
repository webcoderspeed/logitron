import express from "express";
import fs from "fs";
import readline from "readline";

const app = express();
const PORT = 1338;
const logRegex = /\[(.*?)\] (\w+):(?:\[([a-f0-9-]+)\])?(.*)/;
const timerRegex = /\[timer: ([0-9.]+s)\]:?/;

interface LogEntry {
    id?: string;
    timestamp: string;
    level: string;
    data: any;
}

export const startServer = (logFilePath: string) => {
    async function parseLogFile(page: number, limit: number, level?: string, traceId?: string): Promise<{ total: number, data: LogEntry[] }> {
        const stream = fs.createReadStream(logFilePath, "utf-8");
        const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

        let logs: LogEntry[] = [];
        let total = 0;
        let start = (page - 1) * limit;
        let end = start + limit;

        for await (const line of rl) {
            const match = line.match(logRegex);
            if (!match) continue;

            const [, timestamp, logLevelRaw, parsedTraceId, rawData] = match;
            const logLevel = logLevelRaw ? logLevelRaw.toLowerCase() : "unknown";

            if (level && logLevel !== level.toLowerCase()) continue;
            if (traceId && parsedTraceId !== traceId) continue;

            let data = null
            let executionTime = null;

            try {
                executionTime = rawData?.match(timerRegex)?.[1];
                data = rawData?.replace(timerRegex, "").replace(/^\s*:\s*/, "").trim();
                data = data ? JSON.parse(data) : null;
            } catch {
                data = rawData?.replace(timerRegex, "").replace(/^\s*:\s*/, "").trim();
            }

            if (total >= start && total < end) {
                logs.push({
                    id: parsedTraceId && parsedTraceId.length > 0 ? parsedTraceId : undefined,
                    timestamp: timestamp!,
                    level: logLevel,
                    data,
                    ...(executionTime && {
                        executionTime
                    })
                });
            }
            total++;
        }

        return { total, data: logs };
    }

    app.get("/logs", async (req, res) => {
        let { page = "1", limit = "10", level, traceId } = req.query;
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);

        if (!fs.existsSync(logFilePath)) {
            return res.status(400).json({ error: "File not found" });
        }

        const { total, data } = await parseLogFile(pageNumber, pageSize, level as string, traceId as string);
        res.json({ total, page: pageNumber, limit: pageSize, data });
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}