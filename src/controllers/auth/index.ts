import { Router } from "express";
import registerHandler from "./register";
import login from "./login"; 
import authMe from "./authMe";
import authMiddleware from "../../middleware/authMiddleware";
export default (router: Router) => {

  router.post("/register", registerHandler); 
  router.post("/login", login);
  router.post("/authMe", authMiddleware, authMe);
};
