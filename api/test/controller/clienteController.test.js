import app from '../../../server.js';
import request from 'supertest';

let server;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTcwMDEzNzI5NSwiZXhwIjoxNzAwMTY2MDk1fQ.0l8CYKbDUKWC5irDL_lMdQqFjd0na5TWAKmINSoNI7A'


//Subindo o servidor antes de  cada teste
beforeEach(()=>{
  const port = 6000;
  server = app.listen(port);
})



describe('GET em /cliente', ()=>{
  it('Deve retornar uma lista de clientes', async()=>{
    const cliente = {
      id: 1,
      nome: "Ygor",
      email: "ygorsilva456@gmail.com",
      cpf: "56963245878",
      cep: "72850-620",
      rua: "Rua lorena",
      numero: 45,
      bairro: "Jardim zuleika",
      cidade: "Luziânia",
      estado: "GO",
      deletedAt: null,
      created_at: "2023-11-09T20:07:51.000Z",
      updated_at: "2023-11-09T20:07:51.000Z"
    }

    
    const resposta = await request(app)
    .get('/cliente')
    .expect('content-type',/json/)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    expect(200)
    expect(resposta.body).toContainEqual(cliente)
  })

  it('Deve retornar um cliente esquecifico por id parmas', async()=>{
    const cliente = {
      id: 1,
      nome: "Ygor",
      email: "ygorsilva456@gmail.com",
      cpf: "56963245878",
      cep: "72850-620",
      rua: "Rua lorena",
      numero: 45,
      bairro: "Jardim zuleika",
      cidade: "Luziânia",
      estado: "GO",
      deletedAt: null,
      created_at: "2023-11-09T20:07:51.000Z",
      updated_at: "2023-11-09T20:07:51.000Z"
    }
    const resposta =  await request(app)
    .get('/cliente/1')
    .expect('content-type',/json/)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(200)
    expect(resposta.body).toEqual(cliente)
  })

  it('Deve trazer um erro 404 quando cliente não encontrado', async()=>{
    const resposta =  await request(app)
    .get('/cliente/100000')
    .expect('content-type',/json/)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(404)
    expect(resposta.body).toEqual({mensagem: 'Cliente não encontrado.'})
  })

  it('Deve trazer um erro 400 quando colocar um params inválido', async()=>{
    const resposta =  await request(app)
    .get('/cliente/a')
    .expect('content-type',/json/)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(400)
  })
})

describe('POST em /cliente', ()=>{
  it.skip('Deve cadastrar cliente e retornar o objeto cliente ', async()=>{
    const cliente = {
      nome: "Ronaldo",
      email: "ronaldinho@gmail.com",
      cpf: "45696585456",
    }

    const resposta = await request(app)
    .post('/cliente')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(201)
    expect(typeof resposta.body).toBe('object')
    expect(resposta.body).toHaveProperty('nome', 'email', 'cpf')
  })


  it('Deve dar erro 400 quando colocar algum campo obrigatorio errado', async()=>{
    const cliente = {
      nome: "Ronaldo",
      email: "ronaldinho@gmail.com",
      cpf: "456965854",
    }

    const resposta = await request(app)
    .post('/cliente')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(400)
  })

  it('Deve dar erro 409 se já existe cpf, ou email cadastrado em cliente', async()=>{
    const cliente = {
      nome: "Ronaldo",
      email: "ronaldinho@gmail.com",
      cpf: "45696585456",
    }

    const resposta = await request(app)
    .post('/cliente')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(409)
  })
})

describe('PUT em clientes', ()=>{
  it('Deve atualizar cliente , retornar status 200 e uma mensagem', async()=>{
    const cliente = {
      cpf:56369875636,
      email:"ronaldinhoa@gmail.com",
      nome:"ronaldo"
    }

    const resposta = await request(app)
    .put('/cliente/18')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(200)
    expect(resposta.body).toEqual({mensagem: 'Cliente atualizado com sucesso.'})
  })

  it('Deve dar erro status 409 causado por conflito de email ou cpf já cadastrados', async()=>{
    const cliente = {
      cpf:56369875636,
      email:"ygorsilva456@gmail.com",
      nome:"ronaldo"
    }

    const resposta = await request(app)
    .put('/cliente/18')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(409)
    expect(resposta.body).toEqual({mensagem: 'Email, ou cpf já por outro cliente'})
  })

  it('Deve dar erro status 400 causado por parmas inválido', async()=>{
    const cliente = {
      cpf:56369875636,
      email:"ygorsilva456@gmail.com",
      nome:"ronaldo"
    }

    const resposta = await request(app)
    .put('/cliente/a')
    .set('Authorization', `Bearer ${token}`)
    .send(cliente)
    expect(resposta.statusCode).toEqual(400)
  })
})

//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});
