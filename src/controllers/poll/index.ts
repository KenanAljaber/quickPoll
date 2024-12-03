import { Router } from "express";
import create from "./create";
import list from "./list";
import findById from "./findById";
import destroy from "./destroy";
import participate from "./participate";
import authenticateAnonymous from "./authenticateAnonymous";

const router = Router();
router.post(`/`, create);
router.post(`/:id/participate`, participate);
router.get("/list",list);
router.get("/:id",findById);
router.delete("/:id",destroy);
router.post("/anonymous/authenticate",authenticateAnonymous);


export default router;
