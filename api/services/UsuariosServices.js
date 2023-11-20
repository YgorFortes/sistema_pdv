import Usuario from '../models/Usuario.js';
import criarHashSenha from "../helpers/criarHashSenha.js";
import verificaSenha from '../helpers/verificaSenha.js';
import { criarToken,  resgatarPayLoadToken } from "../helpers/token.js";
import ErroCustomizado from '../erros/ErroCustomizado.js';
class UsuariosServices {
 
  async criarUsuario(usuarioCorpo){
    const {email, senha} = usuarioCorpo;
    try {
      
      const [emailExiste] = await Usuario.pegarPorEmail({email});

      if(!emailExiste){
        const usuario = new Usuario(usuarioCorpo);
        usuario.senha = criarHashSenha(senha);
        await usuario.salvar();
        return 'Usuario cadastrado com sucesso.';
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
      return {resultado: 'Usuário logado com sucesso', token};
    
    } catch (erro) {
      throw erro;
    }
  }

  async atualizarUsuario(usuarioCorpo, idUsuario){
    try {
      console.log(usuarioCorpo, idUsuario)
      const emailUnico = await Usuario.verificarEmailUnico({email: usuarioCorpo.email}, {id: idUsuario});
      console.log(emailUnico)
      if(emailUnico.length){
        throw new ErroCustomizado('Email já cadastrado em outra conta.', 409);
      }

      const [usuarioAtual] = await Usuario.pegarPeloId({id: idUsuario});
      console.log(usuarioAtual)
      const usuarioNovo = new Usuario({id: usuarioAtual.id, ...usuarioCorpo});
      
      const resposta = await usuarioNovo.salvar(usuarioNovo);
      return resposta;

    } catch (erro) {
      throw erro;
    }
  }

  async detalharUsuario(id){
    try {
      const [usuario] = await Usuario.pegarPeloId({id});

      const usuarioSemSenha = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        created_at: usuario.created_at,
        updated_at: usuario.deletedAt,
        deletedAt: null
      }
     
      return usuarioSemSenha;
    } catch (erro) {
      throw erro;
    }
  }
}


export default UsuariosServices;