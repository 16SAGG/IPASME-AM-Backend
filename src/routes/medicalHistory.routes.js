import { Router } from "express";
import { createMedicalHistory, deleteMedicalHistory, getMedicalHistories, getMedicalHistory, updateMedicalHistory } from "../controllers/medicalHistory.controllers.js";
import {verifyToken, isReceptionist, isReceptionistOrIsDoctor, isReceptionistOrIsDoctorOwnerMedicalHistory} from "../middlewares/index.js"

const router = Router()

router.get('/medical_histories', [verifyToken], getMedicalHistories)
router.get('/medical_histories/:id', [verifyToken], getMedicalHistory)
router.post('/medical_histories', [verifyToken, isReceptionistOrIsDoctor], createMedicalHistory)
router.patch('/medical_histories/:id', [verifyToken, isReceptionistOrIsDoctorOwnerMedicalHistory], updateMedicalHistory )
router.delete('/medical_histories/:id', [verifyToken, isReceptionistOrIsDoctorOwnerMedicalHistory], deleteMedicalHistory)


export default router