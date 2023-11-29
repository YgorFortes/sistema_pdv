import { Router } from "express";
import verificarToken from "../middlewares/verificarToken.js";
import PedidosController from "../controller/PedidosController.js";
const router = Router();

router.post('/pedido', PedidosController.cadastrarPedidos)


export default router;