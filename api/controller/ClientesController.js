import  Services  from '../services/index.js';
const {ClientesServices} = Services;
const clienteServices = new ClientesServices;

class ClienteController {

  
  static async cadastrarCliente(req, res ,next){
    console.log('Entrou');
  }
}

export default ClienteController;