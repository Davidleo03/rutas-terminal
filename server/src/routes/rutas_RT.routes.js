import { Router } from "express";

import RutasTRController from "../controllers/rutas_TR.controller.js";


const router = Router();
router.get("/", RutasTRController.getAllRutasTR);
router.post("/", RutasTRController.createRutaTR);
router.put("/:id", RutasTRController.updateRutaTR);
router.delete("/:id", RutasTRController.deleteRutaTR);

export default router;

