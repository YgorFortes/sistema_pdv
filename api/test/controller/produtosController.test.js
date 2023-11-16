
import app from '../../../server.js';
import request from 'supertest';

let server;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTcwMDEzNzI5NSwiZXhwIjoxNzAwMTY2MDk1fQ.0l8CYKbDUKWC5irDL_lMdQqFjd0na5TWAKmINSoNI7A'

//Subindo o servidor antes de  cada teste
beforeEach(()=>{
  const port = 3000;
  server = app.listen(port);
})

describe('GET em /produto', ()=>{

  it('Deve retornar todos os produtos quando categoria não é fornecedida', async()=>{

    const produto ={
      id: 1,
      descricao: "Senhor dos aneis: A sociedade do anel",
      quantidade_estoque: 5,
      valor: 45.4,
      categoria_id: 5,
      created_at: "2023-11-08T14:05:44.000Z",
      updated_at: "2023-11-08T14:05:44.000Z",
      deletedAt: null
    }

    const resposta = await request(app)
    .get('/produto')
    .expect('content-type',/json/)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toEqual(200)
    expect(typeof resposta.body).toBe('object');
    expect(Array.isArray(resposta.body)).toBe(true)
    expect(resposta.body).toContainEqual(produto)
  })

  it('Deve retornar uma lista de produtos de um categoria especifica quando categoria_id é fornecida', async()=>{
    const produto ={
      id: 1,
      descricao: "Senhor dos aneis: A sociedade do anel",
      quantidade_estoque: 5,
      valor: 45.4,
      categoria_id: 5,
      created_at: "2023-11-08T14:05:44.000Z",
      updated_at: "2023-11-08T14:05:44.000Z",
      deletedAt: null
    }

    const resposta = await request(app)
    .get('/produto?categoria_id=5')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toEqual(200)
    expect(typeof resposta.body).toBe('object');
    expect(resposta.body).toContainEqual(produto)
  })

  it('Deve retornar o erro 404 se id de categoria_id não existe', async ()=>{
    const resposta = await request(app)
    .get('/produto?categoria_id=55')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toEqual(404)
    expect(resposta.body).toEqual({ mensagem: 'Categoria não encontrada.' });
  })

  it('detalha produto por params', async()=>{
    const produto = {
      id: 14,
      descricao: "Camisa",
      quantidade_estoque: 5,
      valor: 45.5,
      categoria_id: 1,
      created_at: "2023-11-16T17:22:23.000Z",
      updated_at: "2023-11-16T17:22:23.000Z",
      deletedAt: null
    }
   const resposta = await request(app)
    .get('/produto/14')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toEqual(200)
    expect(resposta.body).toEqual(produto)
  })

  it('Deve retornar um erro 404 quando não encontrar produto', async ()=>{
    const resposta = await request(app)
    .get('/produto/140000')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toEqual(404)
    expect(resposta.body).toEqual({mensagem: 'Produto não encontrado.'})
  })
  
})


describe('POST em /produto',  ()=>{

  it.skip('Deve cadastrar  produto e retorna um objeto com o produto cadastrado', async()=>{
    const produto = {
      descricao: 'Roupa',
      categoria_id: 1,
      valor: 45.5,
      quantidade_estoque: 2
    }
  
    const resposta = await request(app)
    .post('/produto')
    .set('Authorization', `Bearer ${token}`)
    .send(produto)
    expect(resposta.statusCode).toEqual(201)
    expect(typeof resposta.body).toBe('object')
  })

  it('Deve lançar erro 404 e mensagem de categoria não encontrada' ,async()=>{
    const produto = {
      descricao: 'Roupa',
      categoria_id: 1000000000,
      valor: 45.5,
      quantidade_estoque: 2
    }
    const resposta = await request(app)
    .post('/produto')
    .set('Authorization', `Bearer ${token}`)
    .send(produto)
    expect(resposta.body).toEqual({ mensagem: 'Nenhum categoria encontrada.' })
  })

  it('Deve lançar um erro 404 quando enviado corpo vazio', async()=>{
    const resposta = await request(app)
    .post('/produto')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(resposta.statusCode).toEqual(400)
  })

  it('Deve lançar um erro 400 se estiver errado uma das propriedades', async()=>{
    const produto = {
      descricao: 'Roupa',
      categoria_id: 1,
      valor: 45.5,
      quantidade_estoque: 'dois'
    }
    const resposta = await request(app)
    
    .post('/produto')
    .set('Authorization', `Bearer ${token}`)
    .send(produto)
    expect(resposta.statusCode).toEqual(400)
  })
})

describe('PUT em /produto', ()=>{

  it('Deve atualizar produto e retorna uma mensagem de sucesso', async()=>{
    const produtoAtualizado = {
      descricao: 'Camisa',
      categoria_id: 1,
      valor: 45.5,
      quantidade_estoque: 5
    }

    const resposta=  await request(app)
    .put('/produto/14')
    .set('Authorization', `Bearer ${token}`)
    .send(produtoAtualizado)
    expect(resposta.statusCode).toBe(200)
    expect(resposta.body).toEqual({mensagem: 'Produto atualizado com sucesso'})
  })

  it('Deve mandar um erro 404 quando o produto não existe', async ()=>{
    const produtoAtualizado = {
      descricao: 'Camisa',
      categoria_id: 1,
      valor: 45.5,
      quantidade_estoque: 5
    }
    const resposta=  await request(app)
    .put('/produto/1400')
    .set('Authorization', `Bearer ${token}`)
    .send(produtoAtualizado)
    expect(resposta.statusCode).toBe(404)
    expect(resposta.body).toEqual({mensagem: 'Produto não encontrado.'})
  })


  it('Deve mandar um erro 404 quando o categoria não existe', async ()=>{
    const produtoAtualizado = {
      descricao: 'Camisa',
      categoria_id: 10000000000000,
      valor: 45.5,
      quantidade_estoque: 5
    }
    const resposta=  await request(app)
    .put('/produto/14')
    .set('Authorization', `Bearer ${token}`)
    .send(produtoAtualizado)
    expect(resposta.statusCode).toBe(404)
    expect(resposta.body).toEqual({mensagem: 'Categoria não encontrada.'})
  })


  it('Deve mandar um erro 400 quando mandar um body vazio', async()=>{
    const resposta=  await request(app)
    .put('/produto/14')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(resposta.statusCode).toBe(400)
  })

  it('Deve mandar um erro 400 quando mandar id no params errado', async()=>{
    const resposta=  await request(app)
    .put('/produto/a')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    expect(resposta.statusCode).toBe(400)
  })
})

describe('DELETE em /produto', ()=>{
  it('Faz um soft delete em produto e retorna mensagem', async()=>{
    const resposta = await request(app)
    .delete('/produto/14')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(200)
    expect(resposta.body).toEqual({mensagem: 'Produto excluido com sucesso.'})
  })

  it('Deve dar um erro 404 quando produto não encontrado', async()=>{
    const resposta = await request(app)
    .delete('/produto/1400000')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(404)
    expect(resposta.body).toEqual({mensagem: 'Produto não encontrado.'})
  })

  it('Deve dar erro 400 quando o params for incorreto', async()=>{
    const resposta = await request(app)
    .delete('/produto/a')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(400)
  })
})

describe('POST reativar em /produto', ()=>{
  it('Reativa um produto desativado e retorna mensagem', async()=>{
    const resposta = await request(app)
    .post('/produto/reativar/14')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(200)
    expect(resposta.body).toEqual({mensagem: 'Produto reativado com sucesso.'})
  })

  it('Deve dar um erro 404 quando produto não encontrado', async()=>{
    const resposta = await request(app)
    .post('/produto/reativar/1400000000')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(404)
    expect(resposta.body).toEqual({mensagem: 'Produto não encontrado.'})
  })

  it('Deve dar erro 400 quando o params for incorreto', async()=>{
    const resposta = await request(app)
    .post('/produto/reativar/a')
    .set('Authorization', `Bearer ${token}`)
    expect(resposta.statusCode).toBe(400)
  })
})


//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});
