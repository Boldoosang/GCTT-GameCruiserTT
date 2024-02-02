import express from "express";
import { errorPage } from "../controllers/error.js";

const router = express.Router();

router.use(errorPage);

export default router;
