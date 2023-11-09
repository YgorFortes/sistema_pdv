import { clienteSchema } from '../schemas/clientesSchema.js';
import  Services  from '../services/index.js';
const {ClientesServices} = Services;
const clienteServices = new ClientesServices;


class ClienteController {


  static async cadastrarCliente(req, res ,next){
   try {
    const dadosValidados = await clienteSchema.fields.body.validate(req.body);
 
    const {nome, email, cpf, cep, rua, numero, bairro, cidade, estado} = dadosValidados;

    const emailOuCpfCadastrado = await clienteServices.verificaUnidadeEmailCpf(email, cpf);
    
    if(emailOuCpfCadastrado.length){
      return res.status(409).json({mensagem: 'Email, ou cpf já cadastrado'});
    }

    const cliente = {
      nome, email, cpf, 
      cep, rua, numero,
      bairro, cidade, estado
    }

    const id = await clienteServices.criarRegistro(cliente);
    
    const [novoCliente] = await clienteServices.listarRegistroPorParametro({id: id});

    if(!novoCliente){
      return res.status(404).json({mensagem: 'Novo cliente não cadastrado.'});
    }

    return res.status(201).json(novoCliente);
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
      const {nome, email, cpf, cep, rua, numero, bairro, cidade, estado} = dadosValidados.body;
 
      const emailOuCpfUnico = await clienteServices.veirificaEmailCpfUnico(email, cpf, id);
      
      if(emailOuCpfUnico.length){
        return res.status(409).json({mensagem: 'Email, ou cpf já por outro cliente'});
      }

      const novaInfoCliente = {
        nome, email, cpf, 
        cep, rua, numero,
        bairro, cidade, estado
      }

      const resultadoAtualizacao = await clienteServices.atualizarRegistro(novaInfoCliente, {id});

      if(resultadoAtualizacao <1){
        return res.status(409).json({mensagem: 'Cliente não atualizado.'});
      }

      return res.status(200).json({mensagem: 'Cliente atualizado com sucesso.'});
    } catch (erro) {
      next(erro);
    }
  }
}

export default ClienteController;