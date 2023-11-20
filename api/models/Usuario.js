import db from "../db/conecaodb.js";
class Usuario {
  constructor({
    id,
    nome,
    email,
    senha,
    created_at,
    updated_at,
    deletedAt,
    
  }){
    this.id = id,
    this.nome = nome,
    this.email = email,
    this.senha = senha
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deletedAt = null || deletedAt;
  }

  static async pegarPeloId(id){
    return db('usuarios').where(id).whereNull('deletedAt');
  }

  async criar(){
    const [idResultadoCriado] = await db('usuarios').insert(this);
    const [resultado] = await db('usuarios').where({id: idResultadoCriado});
    return new Usuario(resultado);
  }

  async atualizar(id){
    await db('usuarios').where('id', id).update({...this, updated_at: new Date()});
    return db('usuarios').where('id', id);
  }

  static async verificarEmailUnico(email, id){
    return db('usuarios').where(email).andWhereNot(id).whereNull('deletedAt');
  }

  static async pegarPorEmail(email){
    return db('usuarios').where(email).whereNull('deletedAt');
  }

  async salvar(){
    if(this.id){
      const resultado = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }
}

export default Usuario;


