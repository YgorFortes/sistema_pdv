import e from "express";
import { produtosCadastrarSchema, produtosEditarSchema, produtosListarSchema } from "../schemas/produtosSchema.js";
import Services from '../services/index.js';
const {ProdutosServices} = Services;
const produtosServices = new ProdutosServices;
const {CategoriasServices} = Services;
const categoriasServices = new CategoriasServices;

class ProdutosControlller {
  static async cadastrarPorduto(req, res, next ){
    try {
      const dadosValidadosCorpo = await produtosCadastrarSchema.validate({body: req.body});

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

  static async atualizarProduto(req, res, next){

    try {
      const valoresProdutoValidado = await produtosEditarSchema.validate(
        {
          body: req.body, 
          params: req.params
        }
      );

      const {id} = valoresProdutoValidado.params;
      const {descricao, quantidade_estoque, valor, categoria_id } = valoresProdutoValidado.body;
      
      const [produto] = await produtosServices.listarRegistroPorParametro({id}); 
      
      if(!produto){
        return res.status(404).json({mensagem: 'Produto não encontrado.'});
      }

      const [categoria] = await categoriasServices.listarRegistroPorParametro({id: categoria_id});

      if(!categoria){
        return res.status(404).json({mensagem: 'Categoria não encontrada.'});
      }

      const novasInforProduto = {
        descricao: descricao,
        quantidade_estoque: quantidade_estoque,
        valor: valor,
        categoria_id: categoria_id
      }
  

      const resultadoAtualizacao = await produtosServices.atualizarRegistro(novasInforProduto, {id});
      if(resultadoAtualizacao < 1){
        return res.status(409).json({mensagem: 'Produto não atualizado.'});
      }
        

      return res.status(200).json({mensagem: 'Produto atualizado com sucesso'});
    } catch (erro) {
      next(erro);
    }
  }

  static async listarProdutos(req, res, next){
    try {
      const dadosValidados =  await produtosListarSchema.validate({query: req.query});
      const {categoria_id} = dadosValidados.query;
      
      if(categoria_id){

        const [categoria] = await categoriasServices.listarRegistroPorParametro({id: categoria_id});

        if(!categoria){
          return res.status(404).json({mensagem: 'Categoria não encontrada.'});
        }
 
        const listaProdutosPorCategoria = await produtosServices.listarRegistroPorParametro({categoria_id});
        return res.status(200).json(listaProdutosPorCategoria);
      }

      const listaProdutos = await produtosServices.listarRegistros();
      return res.status(200).json(listaProdutos);
      
    } catch (erro) {
      console.log(erro)
      next(erro);
    }
  }
}

export default ProdutosControlller;