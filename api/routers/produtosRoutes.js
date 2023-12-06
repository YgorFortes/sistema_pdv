import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
import verificarToken from "../middlewares/verificarToken.js";

import { multerUploader } from "../middlewares/uploadImagem.js";
const router = Router();



router
.get('/produto', verificarToken, ProdutosControlller.listarProdutos)
.get('/produto/:id', verificarToken, ProdutosControlller.detalharProduto)
.post('/produto', verificarToken, multerUploader.single('produto_imagem'), ProdutosControlller.cadastrarPorduto)
.post('/produto/reativar/:id', verificarToken, ProdutosControlller.reativarProduto)
.put('/produto/:id',  verificarToken,multerUploader.single('produto_imagem'),  ProdutosControlller.atualizarProduto)
.delete('/produto/:id', verificarToken, ProdutosControlller.deletarProduto)


export default router;
