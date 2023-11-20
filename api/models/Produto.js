import db from "../db/conecaodb.js";
class Produto {
  constructor({
    id, 
    descricao,
    quantidade_estoque,
    valor,
    categoria_id,
    created_at,
    updated_at,
    deletedAt,
  }){
    this.id = null || id;
    this.descricao = descricao;
    this.quantidade_estoque = quantidade_estoque;
    this.valor = valor;
    this.categoria_id = categoria_id;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deletedAt = null || deletedAt;
  }

  static async pegar(){
    return db('produtos').whereNull('deletedAt');
  }
  
  static async pegarDesativado(id){
    return await db('produtos').where(id);
  }

  static async pegarPeloId(id){
    return db('produtos').where(id).whereNull('deletedAt');
  }

  async criar(){
    const [idProdutoCriado] = await  db('produtos').insert(this);
    const [produtoPegado] = await  db('produtos').where({id: idProdutoCriado}).whereNull('deletedAt');
    return new Produto(produtoPegado);
  }

  async atualizar(id){
    await db('produtos').where('id', id).update({...this, updated_at: new Date()});
    return db('produtos').where('id', id);
  }

  static async excluir(id){
    return db('produtos').update({deletedAt: new Date()}).where(id);
  }


  static async reativar(id){
    return db('produtos').update({deletedAt: null}).where(id);
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



export default Produto;