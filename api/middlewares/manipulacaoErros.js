import Yup from 'yup'
function manipulacaoErros (erro ,req, res, next){
  if (erro instanceof Yup.ValidationError){
    return res.status(400).json({mensagem: erro.message})
  }else  if(erro instanceof Error){
    // console.log(erro)
    return res.status(500).json({mensagem: 'Servidor com problemas! Volte mais tarde.'});
  }
}

function manipulacaoErro404(req, res, next){
  return res.status(404).json({mensagem: 'Desculpe, a página que você está procurando não foi encontrada.'});
}



export {manipulacaoErros, manipulacaoErro404 }