import {Router} from 'express';
import {login, googleLogin, register, logout} from '../controller/authController';

const router: Router = Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/register', register);
router.post('/logout', logout);

export default router;