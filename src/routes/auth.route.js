import { auth } from "../../auth.js";
import { toNodeHandler } from "better-auth/node";
import express from "express";

const router = express.Router();

router.all("/*splat", toNodeHandler(auth));

export default router;
