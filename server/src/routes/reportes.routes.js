import { Router } from 'express';
import ReportesController from '../controllers/reportes.controller.js';

const router = Router();

// GET /reportes/pdf?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
router.get('/pdf', ReportesController.generatePDF);

// POST /reportes/pdf  with JSON body containing filters
router.post('/pdf', ReportesController.generatePDF);

export default router;
