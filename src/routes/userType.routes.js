import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getUserTypes } from "../controllers/userType.controllers.js";

const router = Router()

router.get('/user_type', [verifyToken], getUserTypes)

export default router