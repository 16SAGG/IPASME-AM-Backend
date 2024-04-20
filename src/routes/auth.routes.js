import { Router } from "express";
import { signIn } from "../controllers/auth.controllers.js";

const router = Router()

router.post('/auth/sign_in', signIn)

export default router