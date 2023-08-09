import { Router } from "express";
const router = Router();
import diagramController from '../controllers/diagramController';

router.get('/', diagramController.getDiagrams);
router.get('/:id', diagramController.getDiagram);
router.post('/', diagramController.createDiagram);
router.put('/:id', diagramController.updateDiagram);
router.put('/name/:id', diagramController.updateDiagramName);
router.delete('/:id', diagramController.deleteDiagram);

export default router;