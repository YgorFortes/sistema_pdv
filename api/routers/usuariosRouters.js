import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.post('/usuario', UsuariosController.criarUsuario)
.post('/login',  UsuariosController.login)
.get('/usuario', verificarToken, UsuariosController.detalharUsuario)
.put('/usuario', verificarToken,  UsuariosController.atualizarUsuario)
.delete('/usuario', verificarToken, UsuariosController.excluirUsuario)

export default router;
