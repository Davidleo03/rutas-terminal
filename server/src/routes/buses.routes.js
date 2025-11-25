import { Router } from "express";

import BusesController from "../controllers/buses.controller.js";


const router = Router();

router.get("/", BusesController.getBuses);

router.post("/", BusesController.createBus);

router.put("/:busId", BusesController.updateBus);

router.delete("/:busId", BusesController.deleteBus);

router.get("/:empresaId", BusesController.getBusByEmpresa);

export default router;

