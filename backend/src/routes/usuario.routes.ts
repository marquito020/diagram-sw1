import { Router } from "express";
const router = Router();
import usuarioController from '../controllers/usuarioController';

router.post('/', usuarioController.registrarUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
/* router.delete('/:id', usuarioController.eliminarUsuario); */

export default router;
