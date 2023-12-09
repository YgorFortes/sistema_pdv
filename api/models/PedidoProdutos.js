import db from "../db/conecaodb.js";
class PedidoProduto {
  constructor({
      id,
      pedido_id, 
      produto_id, 
      quantidade_produto,
      valor_produto
    }){
    this.id = id || null;
    this.pedido_id = pedido_id;
    this.produto_id = produto_id;
    this.quantidade_produto = quantidade_produto;
    this.valor_produto = valor_produto;
  }

  get info(){
    return {
      id: this.id,
      quantidade_produto: this.quantidade_produto,
      valor_produto: this.valor_produto,
      pedido_id: this.pedido_id,
      produto_id: this.produto_id,
    };
  }

  static async pegarPorId(id){
    const pedidoProduto = await db('pedido_produtos').where(id);
    return pedidoProduto;
  }

  static async pergarPorPedidoId(pedido_id){
    return await db('pedido_produtos').where({pedido_id});
  }

  async criar(){
    const [idResultadoCriado] = await db('pedido_produtos').insert(this);
    const [pedidoCriado] = await db('pedido_produtos').where({id: idResultadoCriado});
    return pedidoCriado;
  }

  async atualizar(id){
    await db('pedido_produtos').where('id', id).update({...this, updated_at: new Date()});
    const[ pedidoProdutoPegado] = await db('pedido_produtos').where({id: id}).whereNull('deletedAt');
    return new Produto(pedidoProdutoPegado);
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


export default PedidoProduto;