import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, getAppointments, updateAppointment } from "../controllers/appointment.controllers.js";
import {isReceptionist, isReceptionistOrIsDoctorOwner, isReceptionistOrIsDoctorOwnerAppointment, verifyToken} from "../middlewares/index.js"

const router = Router()

router.get('/appointments', [verifyToken, isReceptionist], getAppointments)
router.get('/appointments/:id', [verifyToken, isReceptionistOrIsDoctorOwnerAppointment], getAppointment)
router.post('/appointments', [verifyToken, isReceptionist], createAppointment)
router.patch('/appointments/:id', [verifyToken, isReceptionist], updateAppointment )
router.delete('/appointments/:id', [verifyToken, isReceptionist], deleteAppointment)


export default router