import { clienteSchema } from '../schemas/clientesSchema.js';
import  Services  from '../services/index.js';
const {ClientesServices} = Services;
const clienteServices = new ClientesServices;


class ClienteController {

  static async listarClientes(req, res , next){
    try {
      const resultado = await clienteServices.listarClientes();
      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }

  static async listarClientePorId(req, res, next){
    try {
      
      const dadosValidados = await clienteSchema.fields.params.validate(req.params);
      const {id} = dadosValidados;

      const resultado = await clienteServices.listarClientePorId(id);

      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }

  static async cadastrarCliente(req, res ,next){
   try {
    const cliente = await clienteSchema.fields.body.validate(req.body);

    const resultado = await clienteServices.criarCliente(cliente);

    return res.status(201).json({mensagem: 'Cliente cadastrado', resultado});
   } catch (erro) {
    next(erro);
   }
  }

  static async atualizarCliente(req, res, next){
    try {
      const dadosValidados = await clienteSchema.validate(
        {
          body: req.body, 
          params: req.params
        }
      );
      
      const {id} = dadosValidados.params;
      const novaInfoCliente = dadosValidados.body;
      
      const resultado = await clienteServices.atualizarCliente(id, novaInfoCliente);


      return res.status(200).json({mensagem: 'Cliente atualizado com sucesso.', resultado});
    } catch (erro) {
      next(erro);
    }
  }

 
}

export default ClienteController;