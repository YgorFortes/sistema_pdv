import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
import {validacao} from '../middlewares/manipulacaoErrosValidacao.js';
import {registroSchema, loginSchema}  from '../schemas/usuariosSchemas.js'
const router = Router();

router
.post('/usuario', validacao(registroSchema),  UsuariosController.criarUsuario)
.post('/login', validacao(loginSchema), UsuariosController.login)

export default router;
