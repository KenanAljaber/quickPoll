import { Router } from "express";
import track from "./track";


const router:Router = Router();

router.post("/visit", track);

export default router;