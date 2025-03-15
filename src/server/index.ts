import express from "express";
import cors, { CorsOptions } from 'cors';
import { parseLogFile } from "../utils";

const app = express();
const PORT = 1338;
// const logRegex = /\[(.*?)\] (\w+):(?:\[([a-f0-9-]+)\])?(.*)/;
// const timerRegex = /\[timer: ([0-9.]+s)\]:?/;
const logRegex = /^\[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\]$/

export const startServer = ({
    logFilePath, corsOptions
}: {
    logFilePath: string;
    corsOptions: CorsOptions
}) => {

    app.use(cors(corsOptions))



    app.get("/api/logs", async (req, res) => {
        let { page = "1", limit = "10", level, traceId } = req.query;
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);

        const { total, data } = await parseLogFile({
            limit: Number(limit), logFilePath, logRegex, page: Number(page), level: level as string, traceId: traceId as string,
        });
        res.json({ total, page: pageNumber, limit: pageSize, data });
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}