import { Router } from "express";
import authRoutes from "./auth";
export default (router:Router) => {

    authRoutes(router);

}