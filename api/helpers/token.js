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

function resgatarPayLoadToken(req){
  const secret = process.env.SECRET;
  const token = req.get('authorization').split(' ')[1];
  
  const idUsuario =  jwtToken.verify(token, secret).id;

  return idUsuario;
}
export {criarToken, resgatarPayLoadToken}