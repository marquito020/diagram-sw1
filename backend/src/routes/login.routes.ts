import { Router } from "express";
import loginController from '../controllers/loginController';
const router = Router();

router.post('/', loginController.login);
router.get('/', loginController.verifyToken);

export default router;