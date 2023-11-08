import { registroProdutosSchema } from "../schemas/produtosSchema.js";
import Services from '../services/index.js';
const {ProdutosServices} = Services;
const produtosServices = new ProdutosServices;
const {CategoriasServices} = Services;
const categoriasServices = new CategoriasServices;

class ProdutosControlller {
  static async cadastrarPordutos(req, res, next ){
    try {
      const dadosValidadosCorpo = await registroProdutosSchema.validate({body: req.body});

      const {descricao, categoria_id, valor, quantidade_estoque} = dadosValidadosCorpo.body;

      const [categoria] = await categoriasServices.listarRegistroPorParametro({id: categoria_id});
      
      if(!categoria){
        return res.status(404).json({mensagem: 'Nenhum categoria encontrada.'});
      }

      const produto = {
        descricao: descricao,
        categoria_id: categoria_id,
        valor: valor,
        quantidade_estoque: quantidade_estoque
      }

      const [id] = await produtosServices.criarRegistro(produto);
      
      const novoProduto = await produtosServices.listarRegistroPorParametro({id: id});
      return res.status(201).json(novoProduto);
    } catch (erro) {
      next(erro);
    }
  }
}

export default ProdutosControlller;