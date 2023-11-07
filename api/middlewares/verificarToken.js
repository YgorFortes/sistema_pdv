import jwtToken from 'jsonwebtoken';
function verificarToken(req, res , next){
  const tokenHeader = req.headers['authorization'];
  const token = tokenHeader && tokenHeader.split(' ')[1];

  if(!token){
    return res.status(403).json({mensagem: 'Acesso negado.'});
  }

  try {
    const secret = process.env.SECRET;
    jwtToken.verify(token, secret);
    next();
  } catch (erro) {
    return res.status(401).json({mensagem: 'Token inválido.'});
  }
}

export default verificarToken;