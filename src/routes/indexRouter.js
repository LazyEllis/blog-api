import { Router } from "express";
import { sendCatchAllMessage } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.all("/{*splat}", sendCatchAllMessage);

export default indexRouter;
