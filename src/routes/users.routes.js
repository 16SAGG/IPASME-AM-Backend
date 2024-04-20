import { Router } from "express";
import { createUser, deleteUser, getUsers, getUser, updateUser } from "../controllers/users.controllers.js";
import {isAdmin, verifyToken} from "../middlewares/index.js"

const router = Router()

router.get('/users', [verifyToken, isAdmin], getUsers) 
router.get('/users/:id', [verifyToken, isAdmin], getUser)
router.post('/users', [verifyToken, isAdmin], createUser)
router.patch('/users/:id', [verifyToken, isAdmin], updateUser )
router.delete('/users/:id', [verifyToken, isAdmin], deleteUser)


export default router