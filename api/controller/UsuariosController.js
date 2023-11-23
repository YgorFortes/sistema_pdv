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

    

      return res.status(201).json(resultado);
    } catch (erro) {
      next(erro)
    }
  }

  static async login(req, res , next){
    try {

      const usuario = await loginSchema.fields.body.validate(req.body);

      const resultado = await usuariosServices.loginUsuario(usuario);

    

      return res.status(200).json(resultado)
    } catch (erro) {
      next(erro);
    }
  }

  static async detalharUsuario(req, res, next){
    
    try {
      const idUsuario = await resgatarPayLoadToken(req);

      const resultado = await usuariosServices.detalharUsuario(idUsuario);

      return res.status(200).json(resultado)
    } catch (erro) {
      console.log(erro)
      next(erro);
    }
  }

  static async atualizarUsuario(req, res, next){
    try {

      const usuario  = await usuarioEditaroSchema.fields.body.validate(req.body);
      const idUsuario = await resgatarPayLoadToken(req);
      
      const resultado = await usuariosServices.atualizarUsuario(usuario, idUsuario);
   
      return res.status(200).json(resultado);
    } catch (erro) {
  
      next(erro);
    }
  }

  static async excluirUsuario(req, res, next){
    try {
      const idUsuario = await resgatarPayLoadToken(req);

      const resultado = await usuariosServices.excluirUsuario(idUsuario);

      return res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  }
}

export default UsuariosController;