import { Router } from "express";
import { signIn } from "../controllers/auth.controllers.js";

const router = Router()

router.get('/auth/sign_in', signIn)

export default router