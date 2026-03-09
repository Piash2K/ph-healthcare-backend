import { Router } from "express";
import { SpecialtyRoute } from "../modules/specialty/specialty.route";
import { AuthRoutes } from "../modules/auth/auth.router";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRoute);
router.use("/users", UserRoutes);

export const IndexRoutes = router;