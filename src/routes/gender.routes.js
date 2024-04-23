import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getGenders } from "../controllers/gender.controllers.js";

const router = Router()

router.get('/gender', [verifyToken], getGenders)

export default router