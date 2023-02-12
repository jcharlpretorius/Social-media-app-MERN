import express, { Router } from "express";
import { login } from "../controllers/auth.js";

// this will allow express to identify that these routes will all be configured
// allows us to use different files
const router = express.Router();

router.post("/login", login);

export default router;