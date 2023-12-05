import { pedidoPostSchema, pedidoGetSchema } from "../schemas/pedidoSchema.js";
import PedidosServices from "../services/PedidosServices.js";
const pedidoServices  = new PedidosServices();
class PedidosController{

  static async listarPedido(req, res, next){
    try {
      const dadosPedido = await pedidoGetSchema.fields.query.validate(req.query);
      
      const resultado = await pedidoServices.listarPedidos(dadosPedido);

      return res.status(201).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }

  static async cadastrarPedidos(req, res, next){
    try {
      const dadosPedido = await pedidoPostSchema.fields.body.validate(req.body);

      const resultado = await pedidoServices.criarPedido(dadosPedido);

      return res.status(201).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }
}


export default PedidosController;