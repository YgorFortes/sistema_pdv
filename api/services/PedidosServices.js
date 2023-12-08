import Pedido from "../models/Pedido.js";
import ErroCustomizado from "../erros/ErroCustomizado.js";
import ProdutosServices from "./ProdutosServices.js";
import ClientesServices from "./ClientesServices.js";
import { enviarEmail } from "../helpers/enviarEmail.js";

class PedidosServices {
  constructor(){
    this.produtosServices = new ProdutosServices();
    this.clienteServices = new ClientesServices();
  }

  async listarPedidos(dadosPedido){
    const {cliente_id} = dadosPedido;
    try {

      if(cliente_id){
        const cliente = await this.clienteServices.listarClientePorId(cliente_id);
    
        if(cliente.length <1){
          throw new ErroCustomizado('Cliente não encontrado.',404)
        }
      }

      const pedidos = await Pedido.pegar(cliente_id);
      return pedidos;
    } catch (erro) {
      throw erro;
    }
  }

  async listarPedidoPorId(id){
    try {
      const pedido = await Pedido.pegarPorId({id});
      
      if(!pedido){
       return [];
      }
      return pedido;
    } catch (erro) {
      throw erro;
    }
  }

  async criarPedido(dadosPedido){
    const {cliente_id, observacao, pedido_produtos} = dadosPedido;
    try {
      
      const clienteExiste = await this.clienteServices.listarClientePorId(cliente_id);

      if(clienteExiste.length <1){
        throw new ErroCustomizado(`Cliente não encontrado.`, 404);
      }

      let produtos= [];

      //Verificando se produto existe e se tem quantidade desejada no estoque
      for(let pedido_produto of pedido_produtos){
        const {produto_id, quantidade_produto} = pedido_produto;
        const produto = await this.produtosServices.listarProdutoPorId(produto_id);
        const erroProdutoEstoque = validaProdutoEstoque(produto, quantidade_produto);
        
        if(erroProdutoEstoque){
          throw new ErroCustomizado(erroProdutoEstoque, 404);
        }

        produtos.push(produto);

      }

      //Gerando pedido
      const pedidoNovo = new Pedido({...dadosPedido});
      pedidoNovo.gerarPedido(produtos, pedido_produtos);
      const pedidoCriado = await pedidoNovo.salvar();

      if(pedidoCriado){
        //Atualiza o estoque do produto comprado
        produtos.forEach(async (produto, index)=>{
          const quantidadeProdutoRestante = (produto.quantidade_estoque - pedido_produtos[index].quantidade_produto);
          await this.produtosServices.atualizarProduto(produto.id, {quantidade_estoque: quantidadeProdutoRestante});
        });
      }

      enviarEmail(clienteExiste, pedidoCriado, produtos);
    
      return {mensagem: 'Pedido Criado! Verifique o email', pedido: pedidoCriado};
    } catch (erro) {
      throw erro;
    }
  }

}

function validaProdutoEstoque (produto, quantidade_produto){
  const mensagensErro = {
    produtoNaoExiste: `Produto não encontrado.`,
    estoqueEmFalta:  `Estoque do produto '${produto.descricao}' em falta.`
  }

  const mensagemErro = mensagensErro[produto.length < 1  ? 'produtoNaoExiste' : produto.quantidade_estoque < quantidade_produto ? 'estoqueEmFalta': null];

  return mensagemErro;
}

export default PedidosServices;