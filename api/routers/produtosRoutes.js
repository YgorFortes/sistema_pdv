import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
const router = Router();

router
.get('/produtos', ProdutosControlller.listarProdutos)
export default router;