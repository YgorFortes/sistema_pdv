import app from '../../../server.js';
import request from 'supertest';

let server;

let token;


//Subindo o servidor antes de  cada teste
beforeEach(()=>{
  const port = 5000;
  server = app.listen(port);
})



describe('GET em /categorias', ()=>{
  it('Deve retornar todas as categorias', async ()=>{
    const categoria = {
      id: 1,
      descricao: "Informática",
      created_at: "2023-11-08T14:04:49.000Z",
      updated_at: "2023-11-08T14:04:49.000Z",
      deletedAt: null
    }

    const resposta = await request(app)
    .get('/categorias')
    .expect('content-type',/json/)
    .expect(200)
    .set('Accept', 'application/json')
    expect(typeof resposta.body).toBe('object');
    expect(resposta.body).toContainEqual(categoria);
  })

})

//fechando o servidor depois de cada teste
afterEach(()=>{
	server.close();
});


