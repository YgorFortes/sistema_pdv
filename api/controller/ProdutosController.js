import { uploadImagem } from "../middlewares/GerenciadorImagensBackblaze.js";
import { produtosPostSchema, produtosPutSchema, produtosGetSchema, produtosDeleteSchema } from "../schemas/produtosSchema.js";
import Services from '../services/index.js';
const {ProdutosServices} = Services;
const produtosServices = new ProdutosServices;




class ProdutosControlller {

  static async listarProdutos(req, res, next){
    try {
      const dadosValidados =  await produtosGetSchema.fields.query.validate(req.query);
      const {categoria_id} = dadosValidados;
    
      const resultado = await produtosServices.listarProdutos(categoria_id);
      return res.status(200).json(resultado);
      
    } catch (erro) {
      next(erro);
    }
  }

  static async detalharProduto(req, res, next){
    try {
      const dadosValidados =  await produtosGetSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.listarProdutoPorId(id);
      return res.status(200).json(resultado);
    } catch (erro) {
      console.log(erro)
      next(erro);
    }
  }
  
  static async cadastrarPorduto(req, res, next ){
    try {
      
      const dadosProdutoConvertido = JSON.parse(req.body.produto);
      const produto = await produtosPostSchema.fields.body.validate(dadosProdutoConvertido);


      if(req.file){
        const data = new Date().getTime();
        const nomeArquivo =`${data}_${req.file.originalname}`
        const urlImagem = await uploadImagem(nomeArquivo, req.file.buffer);
        produto.produto_imagem = urlImagem;
      }

      const resultado = await produtosServices.cadastrarProduto(produto);

      return res.status(201).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarProduto(req, res, next){

    try {
      const dadosProdutoConvertido = JSON.parse(req.body.produto);
      const dadosValidados = await produtosPutSchema.validate(
        {
          body: dadosProdutoConvertido, 
          params: req.params
        }
      );
    
        
      if(req.file){
        const data = new Date().getTime();
        const nomeArquivo =`${data}_${req.file.originalname}`
        const urlImagem = await uploadImagem(nomeArquivo, req.file.buffer);
        dadosValidados.body.produto_imagem = urlImagem;
      }


      const novaInfoProduto = dadosValidados.body;
     

      const {id} = dadosValidados.params;

      const resultado = await produtosServices.atualizarProduto(id, novaInfoProduto);
  
      return res.status(200).json(resultado );
    } catch (erro) {
      next(erro);
    }
  }


  static async excluirProduto(req, res, next){
    try {
      const dadosValidados =  await produtosDeleteSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.excluirProduto(id);

      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
    
  }

  static async desativarProduto(req, res, next){
    try {
      const dadosValidados =  await produtosDeleteSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.desativarProduto(id);

      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
    
  }

  static async reativarProduto(req, res, next){
    try {
      const dadosValidados =  await produtosPostSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await produtosServices.ativarProduto(id);
  
      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
    
  }
}

export default ProdutosControlller;