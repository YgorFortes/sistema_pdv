import Produto from "../models/Produto.js";
import Categoria from "../models/Categoria.js";
import { object } from "yup";
class ProdutosServices {

  async listarLivros(categoria_id){
    try {
      if(categoria_id){
        const categoriaExiste = await Categoria.pegarPorId({id: categoria_id});

        if(categoriaExiste){
          const resultado = await Produto.pegarPeloId({categoria_id});
          return resultado;
        }

      }else{
        console.log('Não entrou')
        const resultado = await Produto.pegar();
        return resultado;
      }
    } catch (erro) {
      throw new Error(erro.message);
    }
  }

  async listarLivroPorId(id){
    try {
      const resultado = await Produto.pegarPeloId(id);
      return resultado;

    } catch (erro) {
      console.log(erro)
      throw new Error(erro.message);
    } 
  }

  async cadastrarProduto(produtoCorpo){
    try {
      const categoriaExiste = await Categoria.pegarPorId({id: produtoCorpo.categoria_id});
     
      if(categoriaExiste){
        const produto = new Produto(produtoCorpo);
        const resposta = await produto.salvar();
        return {mensagem: 'Produto criado', resposta}
      }
    } catch (erro) {
      console.log(erro)
      throw new Error(erro.message);
    }
  }

  async atualizarProduto(id, produtoCorpo){
    try {
      const {categoria_id} = produtoCorpo;
      const [produtoAtual] = await Produto.pegar({id});
      if(produtoAtual){
        const categoriaExiste = await Categoria.pegarPorId({id: categoria_id});
        if(categoriaExiste){
          const produtoAtual = new Produto({...produtoCorpo});
          const resposta = await produtoAtual.salvar(produtoAtual);
          return {mensagem: 'Produto atualizado', resposta};
        } 
      }
    } catch (erro) {
      throw new Error(erro.message);
    }
  }

}

export default ProdutosServices;