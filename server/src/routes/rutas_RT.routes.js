import { Router } from "express";

import RutasTRController from "../controllers/rutas_TR.controller.js";


const router = Router();
router.get("/", RutasTRController.getAllRutasTR);
router.get("/empresa/:id_empresa", RutasTRController.getRutasTRByEmpresa);
router.get('/report/pdf', RutasTRController.downloadTripsPDF);
router.get('/report/pdf/:id_empresa', RutasTRController.downloadTripsByEmpresaPDF);
router.post("/", RutasTRController.createRutaTR);
router.put("/:id", RutasTRController.updateRutaTR);
router.delete("/:id", RutasTRController.deleteRutaTR);

export default router;

