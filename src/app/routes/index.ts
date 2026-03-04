import { Router } from "express";
import { SpecialtyRoute } from "../modules/specialty/specialty.route";
import { AuthRoutes } from "../modules/auth/auth.router";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", SpecialtyRoute);

export const IndexRoutes = router;