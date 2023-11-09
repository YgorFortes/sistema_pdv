import { Services } from "./services.js";
import db from '../db/conecaodb.js'
class UsuariosServices extends Services{
  constructor(){
    super('usuarios');
  }

  async verificarEmailUnico(parametro, idUsuario){
    return db(this.nomeModelo).where(parametro).andWhereNot({id: idUsuario}).whereNull('deletedAt');
  }
}

export default UsuariosServices;