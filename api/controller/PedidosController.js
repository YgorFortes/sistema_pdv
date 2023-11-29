import { pedidoPostSchema } from "../schemas/pedidoSchema.js";


class PedidosController{

  static async cadastrarPedidos(req, res, next){
    try {
      const pedido = await pedidoPostSchema.fields.body.validate(req.body);

      console.log(pedido)
    } catch (erro) {
      next(erro)
    }
  }
}


export default PedidosController;