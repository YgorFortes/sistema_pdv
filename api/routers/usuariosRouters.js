import { Router } from "express";
import UsuariosController from "../controller/UsuariosController.js";
import {validacao} from '../middlewares/manipulacaoErrosValidacao.js';
import usuarioSchema  from '../schemas/usuariosSchemas.js'
const router = Router();

router
.post('/usuario', validacao(usuarioSchema),  UsuariosController.criarUsuario )

export default router;
