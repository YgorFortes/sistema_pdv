import { Router } from "express";
import { CategoriaController } from "../controller/CategoriasController.js";
const router = Router();

router
.get('/categorias', CategoriaController.listarCategorias)

export default router