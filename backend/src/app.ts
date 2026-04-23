import cors from "cors";
import express, { type Request, type Response } from "express";
import apiRoutes from "./routes/apiRoutes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  }),
);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "backend" });
});

app.use("/api", apiRoutes);

export default app;
