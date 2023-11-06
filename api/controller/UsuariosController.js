import Services from "../services/index.js";
import criarHashSenha from "../helpers/criarHashSenha.js";

const {UsuariosServices} = Services;
const usuariosServices = new UsuariosServices;

class UsuariosController {

  static async criarUsuario(req, res, next){
    try {
      const {nome, email, senha} = req.body;

      const emailExiste = await usuariosServices.listarRegistroPorParametro({email});
     
      if(emailExiste.length){
        return res.status(409).json({mensagem: 'Email já cadastrado'});
      }

      const senhaHash = criarHashSenha(senha);

      const usuario = {
        nome, 
        email, 
        senha: senhaHash
      }

      const [id] = await usuariosServices.criarRegistro(usuario);
      console.log(id)

      return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'});
    } catch (erro) {
  
    
      next(erro);
    }
  }
}

export default UsuariosController;