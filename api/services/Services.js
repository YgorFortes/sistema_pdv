import db from '../db/conecaodb.js'
class Services {
  constructor(nomeModelo){
    this.nomeModelo = nomeModelo
  }

  async listarRegistros(){
    return db(this.nomeModelo)
  }

  async criarRegistro(dados){
    return db(this.nomeModelo).insert(data);
  }
}

export {Services}