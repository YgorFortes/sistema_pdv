import db from "../db/conecaodb.js";

class Cliente {
  constructor({
    id,
    nome,
    email,
    cpf,
    cep, 
    rua, 
    numero,
    bairro,
    cidade,
    estado,
    created_at,
    updated_at,
    deletedAt,
  }){
    this.id = null || id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.cep = null || cep;
    this.rua  = null || rua;
    this.numero = null || numero;
    this.bairro = null || bairro;
    this.cidade = null || cidade;  
    this.estado = null || estado;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deletedAt = null || deletedAt;
  }

  get info(){
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      cpf: this.cpf,
      cep: this.cep, 
      rua: this.rua , 
      numero: this.numero,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
    };
  }



  static async pegar(){
    return db('clientes').whereNull('deletedAt');
  }

  static async pegarPorId(id){
    return db('clientes').where(id).whereNull('deletedAt');
  }

  async criar(){
    const [idClienteCriado] = await db('clientes').insert(this);
    const [clienteCriado] = await db('clientes').where({id: idClienteCriado});
    return new Cliente(clienteCriado);
  }

  async atualizar(id){
    await db('clientes').update({...this, updated_at: new Date()}).where('id', id);
    return db('clientes').where('id', id);
  }


  async salvar(){
    if(this.id){
      const [resultado] = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }



  static async verificaEmail(email){
    return db('clientes').where(email);
  }

  static async verificaCpf(cpf){
    return db('clientes').where(cpf);
  }

  static async excluir(id){
    return db('clientes').delete().where(id);
  }



  static async verificaEmailCpfUnico(email, cpf, id = null){
    const resultado =  db('clientes').where((function (){
      this.where({email: email})
      .orWhere({cpf: cpf})
    }))
    .whereNull('deletedAt');

    if(id){
      resultado.andWhereNot({id});
    }
    return resultado;
  }


}

export default Cliente;