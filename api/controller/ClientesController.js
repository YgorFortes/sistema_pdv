import { clienteSchema } from '../schemas/clientesSchama.js';
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
      return res.status(404).json({mensagem: 'Novo cliente não cadastrado'});
    }

    return res.status(201).json(novoCliente);
   } catch (erro) {
    next(erro)
   }
  }
}

export default ClienteController;