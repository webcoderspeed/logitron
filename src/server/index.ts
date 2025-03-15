import express from "express";
import cors, { CorsOptions } from 'cors';
import { parseLogFile } from "../utils";

const app = express();
const PORT = 1338;
// const logRegex = /\[(.*?)\] (\w+):(?:\[([a-f0-9-]+)\])?(.*)/;
// const timerRegex = /\[timer: ([0-9.]+s)\]:?/;
const logRegex = /^\[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\] \[(.*?)\]$/

export const startServer = ({
  logFilePath,
  corsOptions,
}: {
  logFilePath: string;
  corsOptions: CorsOptions;
}) => {
  app.use(cors(corsOptions));

  app.get("/api/logs", async (req, res) => {
    try {
      let { page = "1", limit = "10", level, traceId, appName, message, execution, searchPayload } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);

      const { total, data } = await parseLogFile({
        logFilePath,
        logRegex,
        page: pageNumber,
        limit: pageSize,
        level: level as string,
        traceId: traceId as string,
        appName: appName as string,
        message: message as string,
        execution: execution as string,
        searchPayload: searchPayload as string,
      });

      res.json({ total, page: pageNumber, limit: pageSize, data });
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};
