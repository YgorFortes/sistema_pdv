class ErroCustomizado extends Error{
  constructor(mensagem = 'Erro interno do servidor', statusCode = 500){
    super(mensagem)
    this.mensagem = mensagem;
    this.statusCode = statusCode;
  }


}

export default ErroCustomizado;