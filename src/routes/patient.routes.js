import { Router } from "express";
import { createPatient, deletePatient, getPatientsSeenBySpecialtyOnADate, getPatient, getPatients, updatePatient } from "../controllers/patient.controllers.js";
import {verifyToken, isReceptionist} from "../middlewares/index.js"

const router = Router()

router.get('/patients', [verifyToken], getPatients)
router.get('/patients/specialty/:id_specialty/:month/:year', [verifyToken], getPatientsSeenBySpecialtyOnADate)
router.get('/patients/:id', [verifyToken], getPatient)
router.post('/patients', [verifyToken, isReceptionist], createPatient)
router.patch('/patients/:id', [verifyToken, isReceptionist], updatePatient )
router.delete('/patients/:id', [verifyToken, isReceptionist], deletePatient)


export default router