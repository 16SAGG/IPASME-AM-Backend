import { Router } from "express";
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from "../controllers/patient.controllers";

const router = Router()

router.get('/patient', getPatients)
router.get('/patient/:id', getPatient)
router.post('/patient', createPatient)
router.patch('/patient/:id', updatePatient )
router.delete('/patient/:id', deletePatient)


export default router