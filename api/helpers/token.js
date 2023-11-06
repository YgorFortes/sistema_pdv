import jwtToken from 'jsonwebtoken';
import 'dotenv/config';
function criarToken(usuario){
  try {
    const payload = {id: usuario.id};
    const secret = process.env.SECRET;
    
    const token = jwtToken.sign(payload, secret, {
      expiresIn: '8h'
    });

    return token;
  } catch (erro) {
    console.log(erro);
  }
 
}

export {criarToken}