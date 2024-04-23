import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getSpecialties, getSpecialty } from "../controllers/specialty.controllers.js";

const router = Router()

router.get('/specialty', [verifyToken], getSpecialties)
router.get('/specialty/:id', [verifyToken], getSpecialty)

export default router