import Yup from 'yup'
function manipulacaoErrosValidacao (erro ,req, res, next){
  
  if(erro instanceof Yup.ValidationError){
    return res.status(400).json({mensagem: erro.message})
  }else{
    return res.status(400).json(erro)
  }
}

function manipulacaoErro404(req, res, next){
  return res.status(404).json({mensagem: 'Desculpe, a página que você está procurando não foi encontrada.'});
}

function manipulacaoErro500(erro,req, res, next){
  if(erro instanceof Error){
    console.log(erro)
    return res.status(500).json({mensagem: 'Servidor com problemas!Volte mais tarde..'});

  }
}



export {manipulacaoErrosValidacao, manipulacaoErro404, manipulacaoErro500}