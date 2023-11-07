import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
import verificarToken from "../middlewares/verificarToken.js";
import {validacao} from '../middlewares/manipulacaoErrosValidacao.js';
import {registroSchema, loginSchema}  from '../schemas/usuariosSchemas.js';
const router = Router();

router
.post('/usuario', validacao(registroSchema),  UsuariosController.criarUsuario)
.post('/login', validacao(loginSchema), UsuariosController.login)
.get('/usuario',verificarToken, UsuariosController.detalharUsuario)

export default router;
