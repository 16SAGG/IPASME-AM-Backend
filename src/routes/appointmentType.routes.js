import { Router } from "express";
import {verifyToken} from "../middlewares/index.js"
import { getAppointmentTypes } from "../controllers/appointmentType.controllers.js";

const router = Router()

router.get('/appointment_type', [verifyToken], getAppointmentTypes)

export default router