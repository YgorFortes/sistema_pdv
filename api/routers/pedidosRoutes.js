import { Router } from "express";
import verificarToken from "../middlewares/verificarToken.js";
import PedidosController from "../controller/PedidosController.js";
const router = Router();

router.get('/pedido', verificarToken, PedidosController.listarPedido)
router.post('/pedido',verificarToken, PedidosController.cadastrarPedidos)


export default router;