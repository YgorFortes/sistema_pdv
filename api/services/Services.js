import db from '../db/conecaodb.js';
import knex from 'knex';
class Services {
  constructor(nomeModelo){
    this.nomeModelo = nomeModelo
  }

  async listarRegistros(){
    return db(this.nomeModelo).whereNull('deletedAt');
  }

  async listarRegistroPorParametro(parametro){
    return db(this.nomeModelo).where(parametro).whereNull('deletedAt');
  }


  async criarRegistro(dados){
    return db(this.nomeModelo).insert(dados);
  }

  async atualizarRegistro(novosDados, parametro){
    return db(this.nomeModelo).update(novosDados).where(parametro);
  }

  async excluirRegistro(parametro){
    return db(this.nomeModelo).update({deletedAt: new Date()}).where(parametro);
  }

  async listarRegistroExcluido(parametro){
    return  db(this.nomeModelo).where(parametro).whereNotNull('deletedAt');
  }
  
  async reativarRegistro(parametro){
    return db(this.nomeModelo).update({deletedAt: null}).where(parametro);
  }


}


export {Services}