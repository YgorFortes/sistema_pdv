import e from "express";
import { produtosSchema } from "../schemas/produtosSchema.js";
import Services from '../services/index.js';
const {ProdutosServices} = Services;
const produtosServices = new ProdutosServices;
const {CategoriasServices} = Services;
const categoriasServices = new CategoriasServices;

class ProdutosControlller {

  static async listarProdutos(req, res, next){
    try {
      const dadosValidados =  await produtosSchema.fields.query.validate(req.query);
      const {categoria_id} = dadosValidados;
    
      const listaProdutos = await produtosServices.listarLivros(categoria_id);
      return res.status(200).json(listaProdutos);
      
    } catch (erro) {
      next(erro);
    }
  }

  static async detalharProduto(req, res, next){
    try {
      const dadosValidados =  await produtosSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.listarLivroPorId({id})

    
    
      return res.status(200).json(resultado);
    } catch (erro) {
      console.log(erro)
      next(erro);
    }
  }
  
  static async cadastrarPorduto(req, res, next ){
    try {
      const produto = await produtosSchema.fields.body.validate(req.body);

      const novoProduto = await produtosServices.cadastrarProduto(produto);

      if(!novoProduto){
        return res.status(404).json({mensagem: 'Categoria não existe'})
      }
  
      return res.status(201).json(novoProduto);
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarProduto(req, res, next){

    try {
      const produto = await produtosSchema.validate(
        {
          body: req.body, 
          params: req.params
        }
      );
      
      const novaInfoProduto = {
        ...produto.body
      }

      const {id} = produto.params;

      const resultado = await produtosServices.atualizarProduto(id, novaInfoProduto);
      if(!resultado){
        return res.status(404).json({ mensagem: 'Produto, ou categoria não existe.'})
      }

      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }


  static async deletarProduto(req, res, next){
    try {
      const dadosValidados =  await produtosSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.excluirProduto(id);

      if(!resultado){
        return res.status(404).json({mensagem: 'Produto não encontrado'})
      }

      return res.status(200).json({mensagem: resultado});
    } catch (erro) {
      next(erro);
    }
    
  }

  static async reativarProduto(req, res, next){
    try {
      const dadosValidados =  await produtosSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.ativarProduto(id);

      if(!resultado){
        return res.status(404).json({mensagem: 'Produto não encontrado'});
      }
  
      return res.status(200).json({mensagem: 'Produto reativado com sucesso.'});
    } catch (erro) {
      next(erro);
    }
    
  }
}

export default ProdutosControlller;