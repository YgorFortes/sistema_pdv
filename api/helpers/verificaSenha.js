import bcrypt from 'bcrypt';
function verificaSenha(senhaDigitada, usuario){
  const checarSenha = bcrypt.compareSync(senhaDigitada, usuario.senha);
  if(checarSenha){
    return checarSenha;
  }
}

export default verificaSenha;