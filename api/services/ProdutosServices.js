import Produto from "../models/Produto.js";
import CategoriasServices from "./CategoriasServices.js";
import ErroCustomizado from "../erros/ErroCustomizado.js";
import { excluirImagem } from "../middlewares/GerenciadorImagensBackblaze.js";

class ProdutosServices {
  constructor(){
    this.categoriasServices = new CategoriasServices();
  }

  async listarProdutos(categoria_id){
    try {
      if(categoria_id){
        const categoriaExiste = await this.categoriasServices.listarCategoriaPorId({id: categoria_id});
        if(categoriaExiste){
          const produto = await Produto.pegarPeloId({categoria_id});
          return produto;
        }
      }else{
        const produtos = await Produto.pegar();
        return produtos;
      }
    } catch (erro) {
      throw erro;
    }
  }

  async listarProdutoPorId(id){
    try {
      const [produto] = await Produto.pegarPeloId({id});
      if(produto){
        return produto;
      }
      return [];
    } catch (erro) {
      throw erro;
    } 
  }

  async cadastrarProduto(dadosProduto){
    try {
      const [categoriaExiste] = await this.categoriasServices.listarCategoriaPorId({id: dadosProduto.categoria_id});
      if(!categoriaExiste){
        throw new ErroCustomizado('Categoria não encontrado.', 404);
      }

      const produtoNovo = new Produto(dadosProduto);
      const produtoCadastrado = await produtoNovo.salvar();
      return {mensagem: 'Produto cadastrado com sucesso.', produto: produtoCadastrado.informacoes};
    } catch (erro) {
      throw erro;
    }
  }

  async atualizarProduto(id, dadosProduto){
    try {
      const [produtoAtual] = await Produto.pegarPeloId({id});
      if(!produtoAtual){
        throw new ErroCustomizado('Produto não encontrado.', 404);
      }
      
      
      const [categoriaExiste] = await this.categoriasServices.listarCategoriaPorId({id: dadosProduto.categoria_id});

      if(!categoriaExiste){
        throw new ErroCustomizado('Categoria não encontrado.', 404);
      } 

      const produtoAtualizado = new Produto({id: produtoAtual.id,...dadosProduto});
    
      const produtoSalvo  = await produtoAtualizado.salvar(produtoAtualizado);

      return {mensagem: 'Produto atualizado com sucesso.', produto: produtoSalvo.informacoes};
 
    } catch (erro) {
      throw erro;
    }

  }

  async desativarProduto(id){
    try {
      const [produtoExiste] = await Produto.pegarProdutoPorPedido({id});
      
      if(!produtoExiste){
        throw new ErroCustomizado('Produto não encontrado.', 404);
      }
      
      if(produtoExiste.pedido_produtos.length > 0){
        throw new ErroCustomizado('Produto associado a um pedido',409);
      }

      await Produto.desativar({id});
      return {mensagem: 'Produto desativado com sucesso.'};
    
    } catch (erro) {
      throw erro;
    }
  }

  async ativarProduto(id){
    try {
      const [produtoDesativado] = await Produto.pegarDesativado({id});

      if(!produtoDesativado){
        throw new ErroCustomizado('Produto não encontrado.', 404);
      }
      
      await Produto.reativar({id});
      return  {mensagem: 'Produto ativado com sucesso.'};
    } catch (erro) {
      throw erro;
    }
    
  }

  async excluirProduto(id){
    try {
      const [produtoExiste] = await Produto.pegarProdutoPorPedido({id});

      if(!produtoExiste){
        throw new ErroCustomizado('Produto não encontrado.', 404);
      }

      if(produtoExiste.pedido_produtos.length >1){
        throw new ErroCustomizado('Produto associado a um pedido',409);
      }

      const {produto_imagem} = produtoExiste.produto;
      if(produto_imagem){
        const fileId = produto_imagem.split('fileId=')[1];
        await excluirImagem(fileId);
    
      }

      await Produto.excluir({id});
      return {mensagem: 'Produto excluido com sucesso.'};
    
    } catch (erro) {
      throw erro;
    }
  }
}

export default ProdutosServices;