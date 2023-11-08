import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.post('/produtos', verificarToken, ProdutosControlller.cadastrarPorduto)
.put('/produtos/:id',  verificarToken, ProdutosControlller.atualizarProduto)
export default router;
