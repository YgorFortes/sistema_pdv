import Cliente from "../models/Cliente.js";
import ErroCustomizado from "../erros/ErroCustomizado.js";
class ClientesServices  {
  
  async listarClientes(){
    try {
      const clientes = await Cliente.pegar();
      return clientes;
    } catch (erro) {
      throw erro;
    }
  }

  async listarClientePorId(id){
    try {
      const [cliente] = await Cliente.pegarPorId({id});

      if(!cliente){
        return [];
      }

      return cliente;
    } catch (erro) {
      throw erro;
    }

  }

  async  criarCliente(dadosCliente){
    const {email, cpf} = dadosCliente;
    try {
      await verificarEmailCpfUnicos(email, cpf);

      const clienteNovo = new Cliente(dadosCliente);
      const clienteCadastrado = await clienteNovo.salvar();

      return {mensagem: 'Cliente cadastrado', cliente: clienteCadastrado};
    } catch (erro) {
      throw erro;
    }

  }

  async atualizarCliente(id, dadosCliente){
    const {email, cpf} = dadosCliente;
    try {

      const [clienteAtual] = await Cliente.pegarPorId({id});
      if(!clienteAtual){
        throw new ErroCustomizado('Cliente não encontrado', 404);
      }

      await verificarEmailCpfUnicos(email, cpf, id);

      const clienteAtualizado = new Cliente({id: clienteAtual.id, ...dadosCliente} );

      const clienteSalvo = await clienteAtualizado.salvar();

      return {mensagem: 'Cliente cadastrado', cliente: clienteSalvo};
    } catch (erro) {
      throw erro;
    }

  }


}

async function verificarEmailCpfUnicos(email, cpf, id = null){

  try {
    const [unidadeCadastrada] = await Cliente.verificaEmailCpfUnico(email, cpf, id);
    if(unidadeCadastrada){
      const mensagens = {
        email: 'Email já cadastrado.',
        cpf: 'Cpf já cadastrado.' , 
        ambos:  'Cpf e email já cadastrados.' 
      }
      const mensagem = mensagens[unidadeCadastrada.email === email && unidadeCadastrada.cpf === cpf ? 'ambos' : unidadeCadastrada.email === email ? 'email': 'cpf'];
      throw new ErroCustomizado(mensagem, 409);
    }
  } catch (erro) {
    throw erro;
  }
  
}

export default ClientesServices;