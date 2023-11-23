import Usuario from '../models/Usuario.js';
import criarHashSenha from "../helpers/criarHashSenha.js";
import verificaSenha from '../helpers/verificaSenha.js';
import { criarToken } from "../helpers/token.js";
import ErroCustomizado from '../erros/ErroCustomizado.js';
class UsuariosServices {
 
  async criarUsuario(usuarioCorpo){
    const {email, senha} = usuarioCorpo;
    try {
      
      const [emailExiste] = await Usuario.pegarPorEmail({email});

      if(!emailExiste){
        const usuario = new Usuario(usuarioCorpo);
        usuario.senha = criarHashSenha(senha);
        const novoUsuario = await usuario.salvar();

        return {mensagem: 'Usuário cadastrado com sucesso.',  usuario: novoUsuario.info};
      }else{
        throw new ErroCustomizado('Email já cadastrado', 409);
      }
    } catch (erro) {
      throw erro;
    }
  }

  async loginUsuario(usuarioCorpo){
    const {email, senha} = usuarioCorpo;
    try {
      const [usuario] = await Usuario.pegarPorEmail({email});
      if(!usuario){
        throw new ErroCustomizado('Usuário não encontrado',404);
      }
      const validaSenha = verificaSenha(senha, usuario);

      if(!validaSenha){
        throw new ErroCustomizado('Senha inválida', 401);
      }

      const token = criarToken(usuario);
      return {mensagem: 'Usuário logado com sucesso', token};
    
    } catch (erro) {
      throw erro;
    }
  }

  async atualizarUsuario(usuarioCorpo, idUsuario){
    const {email, senha} =  usuarioCorpo;
    try {
      const emailUnico = await Usuario.verificarEmailUnico({email}, {id: idUsuario});
      if(emailUnico.length){
        throw new ErroCustomizado('Email já cadastrado em outra conta.', 409);
      }

      const [usuarioAtual] = await Usuario.pegarPeloId({id: idUsuario});

      const usuarioNovo = new Usuario({id: usuarioAtual.id, ...usuarioCorpo});

      usuarioNovo.senha = criarHashSenha(senha);
      
      await usuarioNovo.salvar(usuarioNovo);
   
      return {mensagem: 'Usuário atualizado com sucesso.', usuario: usuarioNovo.info};

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
     
      return usuarioDetalhado.info;
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