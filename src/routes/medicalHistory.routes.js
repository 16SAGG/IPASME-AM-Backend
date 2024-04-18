import { Router } from "express";
import { createMedicalHistory, deleteMedicalHistory, getMedicalHistories, getMedicalHistory, updateMedicalHistory } from "../controllers/medicalHistory.controllers.js";

const router = Router()

router.get('/medical_histories', getMedicalHistories)
router.get('/medical_histories/:id', getMedicalHistory)
router.post('/medical_histories', createMedicalHistory)
router.patch('/medical_histories/:id', updateMedicalHistory )
router.delete('/medical_histories/:id', deleteMedicalHistory)


export default router