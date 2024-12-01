import { Router } from "express";
import authRoutes from "./auth";
import pollRoutes from "./poll"
import pollStats from "./pollStats";
export default (router:Router) => {

    router.use("/auth", authRoutes);
    router.use("/poll", pollRoutes);
    router.use("/stats", pollStats);

}