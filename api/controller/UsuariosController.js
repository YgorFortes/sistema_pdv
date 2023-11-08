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
      const dadosValidadosCorpo = await usuarioCadastrarSchema.validate({body: req.body});

      const {nome, email, senha} = dadosValidadosCorpo.body;
    
      const emailExiste = await usuariosServices.listarRegistroPorParametro({email});
      
      if(emailExiste.length){
        return res.status(409).json({mensagem: 'Email já cadastrado'});
      }
      
      const senhaHash = criarHashSenha(senha);
      const usuario = {
        nome: nome,
        email: email,
        senha: senhaHash
      }

      const [id] = await usuariosServices.criarRegistro(usuario);
   
      return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'});
    } catch (erro) {
      next(erro)
    }
  }

  static async login(req, res , next){
    try {

      const dadosValidosCorpo = await loginSchema.validate({body: req.body});
      
      const {email, senha} = dadosValidosCorpo.body;

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
      next(erro);
    }
  }

  static async detalharUsuario(req, res, next){
    
    try {
      const idUsuario = await resgatarPayLoadToken(req);
      console.log(idUsuario)
      const [usuario] = await usuariosServices.listarRegistroPorParametro({id: idUsuario});

      const usuarioSemSenha = {
        nome: usuario.nome,
        email: usuario.email
      }

      return res.status(200).json({usuario: usuarioSemSenha})
    } catch (erro) {
      console.log(erro);
      next(erro);
    }
  }

  static async atualizarUsuario(req, res, next){
    try {

      const dadosValidadosCorpo  = await usuarioEditaroSchema.validate({body: req.body});

      const {nome, email, senha} = dadosValidadosCorpo.body;

      const idUsuario = await resgatarPayLoadToken(req);
      
      const senhaHash = criarHashSenha(senha);
      
      const emailUnico = await usuariosServices.verificarEmailUnico({email: email}, idUsuario);

      if(emailUnico.length){
        return res.status(409).json({mensagem: 'Email já cadastrado em outra conta.'});
      }

      const informacoesUsuario = {
        nome: nome, 
        email: email,
        senha: senhaHash
      }

      const resultadoAtualizacao = await usuariosServices.atualizarRegistro(informacoesUsuario, {id: idUsuario});
      if(resultadoAtualizacao < 1 ){
        return res.status(409).json({mensagem: 'Usuário não atualizado'});
      }

      return res.status(200).json({mensagem: 'Usuário atualizado com sucesso'});
    } catch (erro) {
      console.log(erro);
      next(erro);
    }
  }
}

export default UsuariosController;