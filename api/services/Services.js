import db from '../db/conecaodb.js'
class Services {
  constructor(nomeModelo){
    this.nomeModelo = nomeModelo
  }

  async listarRegistros(){
    return db(this.nomeModelo)
  }

  async listarRegistroPorParametro(parametro){
    return db(this.nomeModelo).where(parametro);
  }


  async criarRegistro(dados){
    return db(this.nomeModelo).insert(dados);
  }


}

export {Services}