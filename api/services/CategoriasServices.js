import { Services } from "./services.js";
import Categoria from "../models/Categoria.js";
class CategoriasServices{

  async listarCategorias(){
    const categorias = await Categoria.pegar();
    return categorias;
  }

  async listarCategoriaPorId(id){
    const categoria = await Categoria.pegarPorId(id);
    return categoria;
  }
}

export default CategoriasServices