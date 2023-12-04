import { pedidoPostSchema } from "../schemas/pedidoSchema.js";
import PedidosServices from "../services/PedidosServices.js";
const pedidoServices  = new PedidosServices();
class PedidosController{

  static async cadastrarPedidos(req, res, next){
    try {
      const dadosPedido = await pedidoPostSchema.fields.body.validate(req.body);

      const resultado = await pedidoServices.criarPedido(dadosPedido);

      return res.status(201).json(resultado);
    } catch (erro) {
      next(erro)
    }
  }
}


export default PedidosController;