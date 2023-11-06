import Services from "../services/index.js";
import criarHashSenha from "../helpers/criarHashSenha.js";
import verificaSenha from "../helpers/verificaSenha.js";
import { criarToken } from "../helpers/token.js";
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
   
      return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'});
    } catch (erro) {
      console.log(erro);
      next(erro);
    }
  }

  static async login(req, res , next){
    const {email, senha} = req.body;
    try {

      const [usuario] = await usuariosServices.listarRegistroPorParametro({email});

      if(!usuario){
        return res.status(404).json({mensagem: 'Email não cadastrado'});
      }

      const senhaValida = verificaSenha(senha, usuario);

      if(!senhaValida){
        return res.status(401).json({mensagem: 'Senha inválida'});
      }

      const token = criarToken(usuario);

      return res.status(200).json({mensagem:'Usuário logado com sucesso', token:  token})
    } catch (erro) {
      console.log(erro);
      next(erro);
    }
  }
}

export default UsuariosController;