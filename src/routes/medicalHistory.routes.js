import { Router } from "express";
import { createMedicalHistory, deleteMedicalHistory, getMedicalHistories, getMedicalHistoriesByPatient, getMedicalHistoriesWithPatientCIAndSpecialty, getMedicalHistory, updateMedicalHistory } from "../controllers/medicalHistory.controllers.js";
import {verifyToken, isReceptionistOrIsDoctor, isReceptionistOrIsDoctorOwnerMedicalHistory} from "../middlewares/index.js"

const router = Router()

router.get('/medical_histories', [verifyToken], getMedicalHistories)
router.get('/medical_histories/patient/specialty', [verifyToken], getMedicalHistoriesWithPatientCIAndSpecialty)
router.get('/medical_histories/patient/:patient_id', [verifyToken], getMedicalHistoriesByPatient)
router.get('/medical_histories/:id', [verifyToken], getMedicalHistory)
router.post('/medical_histories', [verifyToken, isReceptionistOrIsDoctor], createMedicalHistory)
router.patch('/medical_histories/:id', [verifyToken, isReceptionistOrIsDoctorOwnerMedicalHistory], updateMedicalHistory )
router.delete('/medical_histories/:id', [verifyToken, isReceptionistOrIsDoctorOwnerMedicalHistory], deleteMedicalHistory)


export default router