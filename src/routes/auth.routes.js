import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controllers.js";

const router = Router()

router.post('/auth/sign_in', signIn)
router.post('/auth/sign_up', signUp)

export default router