import Yup from 'yup'
function manipulacaoErrosValidacao (erro ,req, res, next){
  
  if(erro instanceof Yup.ValidationError){
    return res.status(400).json({mensagem: erro.message})
  }else{
    return res.status(400).json(erro)
  }
}



export {manipulacaoErrosValidacao}