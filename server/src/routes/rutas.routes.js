import { Router } from 'express';

import RutasController from '../controllers/rutas.controller.js';

const router = Router();

router.get('/', RutasController.getRutas);
router.post('/', RutasController.createRuta);
router.put('/:id', RutasController.updateRuta);
router.delete('/:id', RutasController.deleteRuta);

export default router;