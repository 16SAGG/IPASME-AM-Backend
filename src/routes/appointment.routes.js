import { Router } from "express";

const router = Router()

router.get('/appointments', getUsers)
router.get('/appointments/:id', getUser)
router.post('/appointments', createUser)
router.patch('/appointments/:id', updateUser )
router.delete('/appointments/:id', deleteUser)


export default router