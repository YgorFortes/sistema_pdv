function validacao(schema){
  return async function (req, res, next){
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (erro) {
      return res.status(400).json({mensagem: erro.message})
    }
  }
}


export {validacao}