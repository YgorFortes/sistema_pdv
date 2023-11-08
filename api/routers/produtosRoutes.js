import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.get('/produto', verificarToken, ProdutosControlller.listarProdutos)
.get('/produto/:id', verificarToken, ProdutosControlller.detalharProduto)
.post('/produto', verificarToken, ProdutosControlller.cadastrarPorduto)
.post('/produto/reativar/:id', verificarToken, ProdutosControlller.reativarProduto)
.put('/produto/:id',  verificarToken, ProdutosControlller.atualizarProduto)
.delete('/produto/:id', verificarToken, ProdutosControlller.deletarProduto)


export default router;
