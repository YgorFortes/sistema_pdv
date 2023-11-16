
import app from '../../../server.js';
import request from 'supertest';

let server;

let token;


//Subindo o servidor antes de  cada teste
beforeEach(()=>{
  const port = 8000;
  server = app.listen(port);
})
  

describe('POST em /usuarios', ()=>{

  it.skip('Deve cadastrar Usuário e retorna mensagem', async ()=>{

      const novoUsuario= {
        nome: "n",
        email: "n@gmail.com",
        senha: 'Ygor_45431820',
      } 
   

    const resposta = await request(app)
    .post('/usuario')
    .send(novoUsuario)

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body).toEqual({ mensagem: 'Usuário cadastrado com sucesso'});

  })

  it('Deve logar o usuario', async ()=>{
    const usuario = {
      email: 'n@gmail.com',
      senha: 'Ygor_45431820'
    }

    const resposta = await request(app)
    .post('/login')
    .send(usuario)
    expect(resposta.statusCode).toBe(200)
    expect(resposta.body).toHaveProperty('token')
    token = resposta.body.token
  })
  

  it('Deve retorna mensagem de email já cadastrado', async()=>{
    const novoUsuario = {
      nome: "n",
      email: "larissa@gmail.com",
      senha: 'Ygor_45431820',
    } 

    const reposta = await request(app)
    .post('/usuario')
    .send(novoUsuario)
    expect(reposta.statusCode).toBe(409);
    expect(reposta.body).toStrictEqual({mensagem: 'Email já cadastrado'});
  })

  

  it('Deve retorna uma mensagem de senha inválida', async()=>{
    const usuario = {
      email: "larissa@gmail.com",
      senha: 'Ygor_4543182'
    }

    const resposta = await request(app)
    .post('/login')
    .send(usuario)
    expect(resposta.statusCode).toBe(401);
    expect(resposta.body).toStrictEqual({mensagem: 'Senha inválida'});
  })

  it('Não deve adicionar usuario ao passar o corpo vazio', async ()=>{
    const resposta = await request(app)
    .post('/usuario')
    .send({})
    expect(resposta.statusCode).toBe(400);
  })



  it('Deve retona a mensagem de Email não cadastrado', async()=>{
    const usuario = {
      email: "larisa@gmail.com",
      senha: 'Ygor_45431820'
    }

    const resposta = await request(app)
    .post('/login')
    .send(usuario)
    expect(resposta.statusCode).toBe(404);
    expect(resposta.body).toStrictEqual({mensagem: 'Email não cadastrado'});
  })

});

describe('GET em /usuarios', ()=>{
  it('Deve retorna o usuario detalahdo', async ()=>{

    const usuarioEncontrado =  
      {
        usuario: {
          email: "n@gmail.com", nome: "na"
        }
      }

    const resposta = await request(app)
    .get('/usuario')
    .set('Authorization', `Bearer ${token}`)
    .expect('content-type',/json/)
    .expect(200)
    expect(resposta.body).toEqual(usuarioEncontrado)
  })
})


describe('PUT em /usuario/', ()=>{
  it('Deve atualizar e retorna uma mensagem de sucesso', async ()=>{
    const novoUsuarioAtualizado = {
      nome: "na",
      email: "n@gmail.com",
      senha: 'Ygor_45431820',
    } 


    const reposta = await request(app)
    .put(`/usuario`)
    .set('Authorization', `Bearer ${token}`)
    .send(novoUsuarioAtualizado)
    expect(reposta.statusCode).toBe(200);
    expect(reposta.body).toStrictEqual({mensagem: 'Usuário atualizado com sucesso'});
  })

  it('Deve retorna uma mensagem de email já cadastrado', async ()=>{
    const novoUsuarioAtualizado = {
      nome: "la",
      email: "larissa@gmail.com",
      senha: 'Ygor_45431820',
    } 


    const reposta = await request(app)
    .put(`/usuario`)
    .set('Authorization', `Bearer ${token}`)
    .send(novoUsuarioAtualizado)
    expect(reposta.statusCode).toBe(409);
    expect(reposta.body).toStrictEqual({mensagem: 'Email já cadastrado em outra conta.'});
  })

  it('Deve retorna uma mensagem com status 400', async()=>{

    const reposta = await request(app)
    .put(`/usuario`)
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(reposta.statusCode).toBe(400);
  })
})



//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});

export { token}




