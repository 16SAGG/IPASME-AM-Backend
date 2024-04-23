import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getTurn } from "../controllers/turn.controllers.js";

const router = Router()

router.get('/turn', [verifyToken], getTurn)

export default router