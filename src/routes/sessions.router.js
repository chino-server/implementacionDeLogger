import { Router } from "express";
import { getCurrentSession } from "../controllers/sessions.controllers.js";


const router = Router()

router.get ('/currente', getCurrentSession)

export default router