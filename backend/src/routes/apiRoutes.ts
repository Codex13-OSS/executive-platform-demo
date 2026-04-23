import { Router } from "express";
import {
  convertEntryHandler,
  createEntryHandler,
  getDashboardHandler,
  getTrackingHandler,
  resetDemoStateHandler,
} from "../controllers/demoController";

const apiRoutes = Router();

apiRoutes.get("/dashboard", getDashboardHandler);
apiRoutes.get("/tracking", getTrackingHandler);
apiRoutes.post("/entries", createEntryHandler);
apiRoutes.post("/entries/:id/convert", convertEntryHandler);
apiRoutes.post("/reset", resetDemoStateHandler);

export default apiRoutes;
