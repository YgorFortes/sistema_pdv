import bcrypt from 'bcrypt';
function criarHashSenha(senha){
  const salt = bcrypt.genSaltSync(12)

  const senhaHash =  bcrypt.hashSync(senha, salt);

  return senhaHash;
}

export default criarHashSenha;