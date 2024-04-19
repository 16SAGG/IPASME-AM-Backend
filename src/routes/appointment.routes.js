import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, getAppointments, updateAppointment } from "../controllers/appointment.controllers.js";

const router = Router()

router.get('/appointments', getAppointments)
router.get('/appointments/:id', getAppointment)
router.post('/appointments', createAppointment)
router.patch('/appointments/:id', updateAppointment )
router.delete('/appointments/:id', deleteAppointment)


export default router