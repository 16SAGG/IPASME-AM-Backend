import { Router } from "express";
import { deleteUser, getUsers, getUser, updateUser, getDoctors, getDoctorsBySpecialtyAndTurn } from "../controllers/users.controllers.js";
import {isAdmin, verifyToken} from "../middlewares/index.js"

const router = Router()

router.get('/users', [verifyToken, isAdmin], getUsers)
router.get('/users/doctors', verifyToken, getDoctors)
router.get('/users/doctors/:specialty/:turn/:year/:month/:day', verifyToken, getDoctorsBySpecialtyAndTurn)
router.get('/users/:id', [verifyToken, isAdmin], getUser)
router.patch('/users/:id', [verifyToken, isAdmin], updateUser )
router.delete('/users/:id', [verifyToken, isAdmin], deleteUser)


export default router