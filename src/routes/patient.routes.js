import { Router } from "express";
import { createPatient, deletePatient, getPatient, getPatients, updatePatient } from "../controllers/patient.controllers.js";

const router = Router()

router.get('/patients', getPatients)
router.get('/patients/:id', getPatient)
router.post('/patients', createPatient)
router.patch('/patients/:id', updatePatient )
router.delete('/patients/:id', deletePatient)


export default router