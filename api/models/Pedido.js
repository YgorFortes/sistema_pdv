import db from "../db/conecaodb.js";
import PedidoProduto from "./PedidoProdutos.js";
class Pedido {
  constructor({
    id,
    cliente_id,
    observacao,
    valor_total,
    pedido_produtos,
    created_at,
    updated_at,
    deletedAt,
  }){
    this.id = id || null;
    this.cliente_id = cliente_id;
    this.observacao = observacao || null;
    this.valor_total = valor_total;
    this.pedido_produtos = [];
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deletedAt = null || deletedAt;
  }



    
  calcularValorTotal( valor_total) {
    valor_total = 0;

    for(let pedido_produto of this.pedido_produtos){
      valor_total += pedido_produto.valor_produto;
    }
    return valor_total;
  }

  gerarPedido(produtos, pedidos){

    produtos.forEach((produto, index)=>{
      const pedido_produto = new PedidoProduto(
        {
          id: null,
          produto_id: produto.id,
          quantidade_produto: pedidos[index].quantidade_produto,
          valor_produto: (produto.valor * pedidos[index].quantidade_produto)
        }
      );
      this.pedido_produtos.push(pedido_produto);
    })
    
    this.valor_total = this.calcularValorTotal();
  }
  



  async criar(){
    const [idPedidoCriado] = await db('pedidos').insert(
      {
        cliente_id: this.cliente_id, 
        observacao: this.observacao, 
        valor_total: this.valor_total, 
        deletedAt: this.deletedAt, 
        created_at: this.created_at,
        updated_at: this.updated_at
      }
    );
     
    this.pedido_produtos.forEach(async(pedidoProduto) => {
      const pedidoProdutoCriado = new PedidoProduto({...pedidoProduto, pedido_id: idPedidoCriado})
      pedidoProdutoCriado.salvar();
    });

    const [pedidoCriado] = await db('pedidos').where({id: idPedidoCriado});
    return pedidoCriado;
  }

  async atualizar(id){
    await db('pedidos').where('id', id).update({...this, updated_at: new Date()});
    const[ PedidoPegado] = await db('pedidos').where({id: id}).whereNull('deletedAt');
    return new Pedido(PedidoPegado);
  }

  async salvar(){
    if(this.id){
      const resultado = await this.atualizar(this.id);
      return resultado;
    }

    const resultado = await this.criar();
    return resultado;
  }
}







export default Pedido;