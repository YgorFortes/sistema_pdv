import Cliente from "../models/Cliente.js";
import ErroCustomizado from "../erros/ErroCustomizado.js";
class ClientesServices  {
  
  async listarClientes(){
    try {
      const resultado = await Cliente.pegar();
      return resultado;
    } catch (erro) {
      throw erro;
    }
  }

  async listarClientePorId(id){
    try {
      const resultado = Cliente.pegarPorId({id});
      return resultado;
    } catch (erro) {
      throw erro;
    }
  }

  async  criarCliente(clienteCorpo){
    const {email, cpf} = clienteCorpo;
    try {
      await verificarEmailCpfUnicos(email, cpf);

      const cliente = new Cliente(clienteCorpo);
      const resultado = await cliente.salvar();
      return resultado;
    } catch (erro) {
      throw erro;
    }
  }

  async atualizarCliente(id, clienteCorpo){
    const {email, cpf} = clienteCorpo;
    try {
      await verificarEmailCpfUnicos(email, cpf, id);
      const clienteNovo = new Cliente({id, ...clienteCorpo} );
      const resultado = await clienteNovo.salvar();
      return resultado;
    } catch (erro) {
      console.log(erro)
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