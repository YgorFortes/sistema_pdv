import Services from '../services/index.js';
const {CategoriasServices} = Services;
const categoriasServices = new CategoriasServices;

class CategoriaController{
 
  static async listarCategorias(req, res){
    try {
      const categorias = await categoriasServices.listarRegistros();
      
      res.status(200).json(categorias);
    } catch (erro) {
      res.status(500).json({mensagem: 'Problemas no servidor. Tente novamente mais tarde!'});
    }
  }
}

export {CategoriaController}