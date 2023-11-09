import db from "../db/conecaodb.js";
import { Services } from "./services.js";

class ClientesServices extends Services{
  constructor(){
    super('clientes');
  }

  async verificaUnidadeEmailCpf(email, cpf){
    return db(this.nomeModelo).where((function (){
      this.where({email: email})
      .orWhere({cpf: cpf})
    }))
    .whereNull('deletedAt')
  }

  async veirificaEmailCpfUnico(email, cpf, idCliente){
    return db(this.nomeModelo).where((function (){
      this.where({email: email})
      .orWhere({cpf: cpf})
    }))
    .whereNull('deletedAt').andWhereNot({id: idCliente});
  }
}

export default ClientesServices;