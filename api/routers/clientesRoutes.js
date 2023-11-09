import { Router } from "express";
import ClienteController from "../controller/ClientesController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.post('/cliente', verificarToken, ClienteController.cadastrarCliente)

export default router;