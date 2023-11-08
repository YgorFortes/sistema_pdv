import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";

const router = Router();

router
.post('/produtos', ProdutosControlller.cadastrarPordutos)
export default router;