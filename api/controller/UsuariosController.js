import Services from "../services/index.js";
const {UsuariosServices} = Services;
const usuariosServices = new UsuariosServices;
import usuarioSchema  from '../schemas/usuariosSchemas.js'
class UsuariosController {

  static async criarUsuario(req, res, next){
    try {
      const {nome, email, senha} = req.body;

      return res.status(200).json();
    } catch (erro) {
  
    
      next(erro);
    }
  }
}

export default UsuariosController;