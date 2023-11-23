import db from "../db/conecaodb.js";
class Categoria{
  constructor({
    id, 
    descricao
  }){
    this.id = id || null;
    this.descricao = descricao
  }

  get info(){
    return {
      id: this.id,
      descricao: this.descricao,
    };
  }

  static async pegar(){
    return db('categorias').whereNull('deletedAt');
  }

  static async pegarPorId(id){
    const categoria = await db('categorias').where(id);
    return categoria[0];
  }
}

export default Categoria;