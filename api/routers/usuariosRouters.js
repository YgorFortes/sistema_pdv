import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
import verificarToken from "../middlewares/verificarToken.js";
import {validacao} from '../middlewares/manipulacaoErrosValidacao.js';
import {registroSchema, loginSchema, editarUsuarioSchema}  from '../schemas/usuariosSchemas.js';
const router = Router();

router
.post('/usuario', validacao(registroSchema),  UsuariosController.criarUsuario)
.post('/login', validacao(loginSchema), UsuariosController.login)
.get('/usuario',verificarToken, UsuariosController.detalharUsuario)
.put('/usuario', verificarToken, validacao(editarUsuarioSchema), UsuariosController.atualizarUsuario )

export default router;
