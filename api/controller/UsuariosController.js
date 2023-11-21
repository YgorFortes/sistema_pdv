import Services from "../services/index.js";
import criarHashSenha from "../helpers/criarHashSenha.js";
import verificaSenha from "../helpers/verificaSenha.js";
import { criarToken,  resgatarPayLoadToken } from "../helpers/token.js";
import { usuarioCadastrarSchema, loginSchema, usuarioEditaroSchema } from "../schemas/usuariosSchemas.js";

const {UsuariosServices} = Services;
const usuariosServices = new UsuariosServices;

class UsuariosController {

  static async criarUsuario(req, res, next){
    
    try {
      const usuario = await usuarioCadastrarSchema.fields.body.validate(req.body);

      const resultado = await usuariosServices.criarUsuario(usuario);

      if(!resultado){
        return res.status(409).json({mensagem: 'Email já cadastrado'});
      }

      return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'});
    } catch (erro) {
      next(erro)
    }
  }

  static async login(req, res , next){
    try {

      const usuario = await loginSchema.fields.body.validate(req.body);

      const {resultado, token} = await usuariosServices.loginUsuario(usuario);

    
       if(resultado === 'Senha inválida'){
        return res.status(401).json({mensagem: resultado})
      }

      return res.status(200).json({mensagem: 'Usuário logado com sucesso', token:  token})
    } catch (erro) {
      next(erro);
    }
  }

  static async detalharUsuario(req, res, next){
    
    try {
      const idUsuario = await resgatarPayLoadToken(req);

      const resultado = await usuariosServices.detalharUsuario(idUsuario);

      return res.status(200).json({usuario: resultado})
    } catch (erro) {
      console.log(erro)
      next(erro);
    }
  }

  static async atualizarUsuario(req, res, next){
    try {

      const usuario  = await usuarioEditaroSchema.fields.body.validate(req.body);
      const idUsuario = await resgatarPayLoadToken(req);
      
      const resultado = await usuariosServices.atualizarUsuario(usuario, idUsuario)
   
      return res.status(200).json({mensagem: 'Usuário atualizado com sucesso', resultado});
    } catch (erro) {
  
      next(erro);
    }
  }
}

export default UsuariosController;