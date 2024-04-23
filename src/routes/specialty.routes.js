import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getSpecialties } from "../controllers/specialty.controllers.js";

const router = Router()

router.get('/specialty', [verifyToken], getSpecialties)

export default router