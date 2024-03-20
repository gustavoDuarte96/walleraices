import express from "express";
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar);

router.get('/password-recovery', formularioOlvidePassword);
router.post('/password-recovery', resetPassword);





export default router;