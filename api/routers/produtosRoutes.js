import { Router } from "express";
import ProdutosControlller from "../controller/ProdutosController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router
.post('/produtos', verificarToken, ProdutosControlller.cadastrarPordutos)
export default router;