import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, getAppointments, getAppointmentsByDoctor, getAppointmentsNotIncludesInAMedicalHistory, getAppointmentsWithDoctorAndPatient, getAppointmentsWithDoctorAndPatientByID, updateAppointment } from "../controllers/appointment.controllers.js";
import {isReceptionist, isReceptionistOrIsDoctor, isReceptionistOrIsDoctorOwnerAppointment, verifyToken} from "../middlewares/index.js"

const router = Router()

router.get('/appointments', [verifyToken, isReceptionist], getAppointments)
router.get('/appointments/doctor/patient', [verifyToken, isReceptionist], getAppointmentsWithDoctorAndPatient)
router.get('/appointments/doctor/patient/:id', [verifyToken], getAppointmentsWithDoctorAndPatientByID)
router.get('/appointments/whitout/medical_histories', [verifyToken], getAppointmentsNotIncludesInAMedicalHistory)
router.get('/appointments/doctor/:doctor_id/:year/:month/:day', [verifyToken, isReceptionistOrIsDoctor], getAppointmentsByDoctor)
router.get('/appointments/:id', [verifyToken, isReceptionistOrIsDoctorOwnerAppointment], getAppointment)
router.post('/appointments', [verifyToken, isReceptionist], createAppointment)
router.patch('/appointments/:id', [verifyToken, isReceptionist], updateAppointment )
router.delete('/appointments/:id', [verifyToken, isReceptionist], deleteAppointment)


export default router