import { Router } from "express";
import authRoutes from "./auth";
import pollRoutes from "./poll"
export default (router:Router) => {

    router.use("/auth", authRoutes);
    router.use("/poll", pollRoutes);

}