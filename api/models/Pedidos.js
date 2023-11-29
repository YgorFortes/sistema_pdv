import db from "../db/conecaodb.js";

class Pedidos {
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
    this.id = id;
    this.cliente_id = cliente_id;
    this.observacao = observacao;
    this.valor_total = valor_total;
    this.pedido_produtos = new PedidoProdutos();
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deletedAt = null || deletedAt;
  }

}

export default Pedidos;