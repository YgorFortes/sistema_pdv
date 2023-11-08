import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.get('/produto', verificarToken, ProdutosControlller.listarProdutos)
.get('/produto/:id', verificarToken, ProdutosControlller.detalharProduto)
.post('/produto', verificarToken, ProdutosControlller.cadastrarPorduto)
.put('/produto/:id',  verificarToken, ProdutosControlller.atualizarProduto)


export default router;
