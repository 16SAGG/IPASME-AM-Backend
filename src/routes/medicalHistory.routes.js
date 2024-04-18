import { Router } from "express";
import { createMedicalHistory, deleteMedicalHistory, getMedicalHistories, getMedicalHistory, updateMedicalHistory } from "../controllers/medicalHistory.controllers";

const router = Router()

router.get('/medical_history', getMedicalHistories)
router.get('/medical_history/:id', getMedicalHistory)
router.post('/medical_history', createMedicalHistory)
router.patch('/medical_history/:id', updateMedicalHistory )
router.delete('/medical_history/:id', deleteMedicalHistory)


export default router