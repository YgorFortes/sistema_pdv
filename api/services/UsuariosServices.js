import Usuario from '../models/Usuario.js';
import criarHashSenha from "../helpers/criarHashSenha.js";
import verificaSenha from '../helpers/verificaSenha.js';
import { criarToken } from "../helpers/token.js";
import ErroCustomizado from '../erros/ErroCustomizado.js';
class UsuariosServices {
 
  async criarUsuario(dadosUsuario){
    const {email, senha} = dadosUsuario;
    try {
      
      const [emailExiste] = await Usuario.pegarPorEmail({email});

      if(!emailExiste){
        const novoUsuario = new Usuario(dadosUsuario);
        novoUsuario.senha = criarHashSenha(senha);
        const usuarioCadastrado = await novoUsuario.salvar();

        return {mensagem: 'Usuário cadastrado com sucesso.',  usuario: usuarioCadastrado.informacoes};
      }else{
        throw new ErroCustomizado('Email já cadastrado', 409);
      }
    } catch (erro) {
      throw erro;
    }
    
  }

  async autenticarUsuario(dadosUsuario){
    const {email, senha} = dadosUsuario;
    try {
      const [usuarioExistente] = await Usuario.pegarPorEmail({email});

      if(!usuarioExistente){
        throw new ErroCustomizado('Usuário não encontrado',404);
      }

      const senhaValida = verificaSenha(senha, usuarioExistente);

      if(!senhaValida){
        throw new ErroCustomizado('Senha inválida', 401);
      }

      const token = criarToken(usuarioExistente);
      return {mensagem: 'Usuário logado com sucesso', token};
    
    } catch (erro) {
      throw erro;
    }

  }


  async atualizarUsuario(dadosUsuario, idUsuario){
    const {email, senha} =  dadosUsuario;

    try {
      const emailUnico = await Usuario.verificarEmailUnico({email}, {id: idUsuario});
      if(emailUnico.length){
        throw new ErroCustomizado('Email já cadastrado em outra conta.', 409);
      }

      const [usuarioExistente] = await Usuario.pegarPeloId({id: idUsuario});

      const usuarioAtualizado = new Usuario({id: usuarioExistente.id, ...dadosUsuario});

      usuarioAtualizado.senha = criarHashSenha(senha);
      
      await usuarioAtualizado.salvar(usuarioAtualizado);
   
      return {mensagem: 'Usuário atualizado com sucesso.', usuario: usuarioAtualizado.informacoes};

    } catch (erro) {
      throw erro;
    }

  }

  async detalharUsuario(id){
    
    try {
      const [usuarioEncontrado] = await Usuario.pegarPeloId({id});

      if(!usuarioEncontrado){
        throw new ErroCustomizado('Usuário não encontrado.', 404);
      }

      const usuarioDetalhado = new Usuario(usuarioEncontrado)
     
      return usuarioDetalhado.informacoes;
    } catch (erro) {
      throw erro;
    }

  }

  async excluirUsuario(id){
    try {
      const [usuario] = await Usuario.pegarPeloId({id});
  

      if(!usuario){
        throw new ErroCustomizado('Usuario não encontrado.', 404);
      }

      await Usuario.excluir({id});
      return {mensagem: 'Usuário excluido com sucesso.'};
    
    } catch (erro) {
      throw erro;
    } 
    
  }

  async detalharUsuarioComSenha(id){
    try {
      const [usuario] = await Usuario.pegarPeloId({id});
      
      if(!usuario){
        throw new ErroCustomizado('Usuário não encontrado.', 404);
      }

      return usuario;
    } catch (erro) {
      throw erro;
    }
  }

}


export default UsuariosServices;