import { Router } from 'express';

import EmpresaController from '../controllers/empresa.controller.js';

const router = Router();

router.get('/', EmpresaController.getEmpresas);

router.post('/', EmpresaController.createEmpresa);

router.put('/:id', EmpresaController.updateEmpresa);

router.delete('/:id', EmpresaController.deleteEmpresa);



export default router;
