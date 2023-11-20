import Produto from "../models/Produto.js";
import Categoria from "../models/Categoria.js";
import ErroCustomizado from "../erros/ErroCustomizado.js";
class ProdutosServices {

  async listarProdutos(categoria_id){
    try {
      if(categoria_id){
        const categoriaExiste = await Categoria.pegarPorId({id: categoria_id});

        if(categoriaExiste){
          const resultado = await Produto.pegarPeloId({categoria_id});
          return resultado;
        }
      
      }else{
        const resultado = await Produto.pegar();
        return resultado;
      }
    } catch (erro) {
      throw erro;
    }
  }

  async listarProdutoPorId(id){
    try {
      const resultado = await Produto.pegarPeloId(id);
      return resultado;
    } catch (erro) {
      throw erro;
    } 
  }

  async cadastrarProduto(produtoCorpo){
    try {
      const categoriaExiste = await Categoria.pegarPorId({id: produtoCorpo.categoria_id});
     
      if(!categoriaExiste){
        throw new ErroCustomizado('Categoria não existe', 404);
      }
      const produto = new Produto(produtoCorpo);
      const resposta = await produto.salvar();
      return {mensagem: 'Produto criado', resposta}
      
    } catch (erro) {
      throw erro;
    }
  }

  async atualizarProduto(id, produtoCorpo){
    try {
      const {categoria_id} = produtoCorpo;
      const [produtoAtual] = await Produto.pegarPeloId({id});
      const categoriaExiste = await Categoria.pegarPorId({id: categoria_id});

      if(!produtoAtual){
        throw new ErroCustomizado('Produto não existe', 404);
      }

      if(!categoriaExiste){
        throw new ErroCustomizado('Categoria não existe', 404);
      } 

      const produtoNovo = new Produto({id: produtoAtual.id,...produtoCorpo});
    
      const resposta = await produtoNovo.salvar(produtoNovo);
      return resposta;
 
    } catch (erro) {
      console.log(erro)
      throw erro;
    }
  }

  async excluirProduto(id){
    try {
      const [produtoExiste] = await Produto.pegarPeloId({id});
      if(!produtoExiste){
        throw new ErroCustomizado('Produto não encontrado', 404);
      }

      await Produto.excluir({id});
      return 'Produto excluido com sucesso.';
    
    } catch (erro) {
      throw erro;
    }
  }

  async ativarProduto(id){
    try {
      const [produtoDesativado] = await Produto.pegarDesativado({id});
      if(!produtoDesativado){
        throw new ErroCustomizado('Produto não encontrado', 404);
      }
      
      await Produto.reativar({id});
      return {mensagem: 'Produto ativado'};
    } catch (erro) {
      throw erro;
    }
    
  }
}

export default ProdutosServices;