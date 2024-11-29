import { Router } from "express";
import register from "./register";
import login from "./login"; 
import authMe from "./authMe";
import authMiddleware from "../../middleware/authMiddleware";

const router= Router();

  router.post(`/register`, register); 
  router.post(`/login`, login);
  router.post(`/authMe`, authMiddleware, authMe);

  export default  router;

