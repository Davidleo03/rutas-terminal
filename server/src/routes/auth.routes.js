import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ data: "Hello from Router Users!"});
});

router.post("/login", AuthController.loginUser);


export default router;



