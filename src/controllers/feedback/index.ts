
import { Router } from "express";
import create from "../poll/create";
import destroy from "./destroy";
import list from "./list";
import update from "./update";

const router= Router();

router.post(`/`, create);
router.delete("/:id",destroy);
router.get("/list",list);
router.put("/:id",update);