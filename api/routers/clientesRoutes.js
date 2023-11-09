import { Router } from "express";
import ClienteController from "../controller/ClientesController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.get('/cliente', verificarToken, ClienteController.listarClientes)
.get('/cliente/:id', verificarToken, ClienteController.listarClientePorId)
.post('/cliente', verificarToken, ClienteController.cadastrarCliente)
.put('/cliente/:id',verificarToken, ClienteController.atualizarCliente)

export default router;