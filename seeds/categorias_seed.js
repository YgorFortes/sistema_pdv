import Knex from 'knex';
/**

 *
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
 
  await knex('categorias').del();

  // Insert initial data
  await knex('categorias').insert([
    { id: 1, descricao: 'Informática', created_at: new Date(), updated_at: new Date() },
    { id: 2, descricao: 'Celulares', created_at: new Date(), updated_at: new Date() },
    { id: 3, descricao: 'Beleza e Perfumaria', created_at: new Date(), updated_at: new Date() },
    { id: 4, descricao: 'Mercado', created_at: new Date(), updated_at: new Date() },
    { id: 5, descricao: 'Livros e Papelaria' , created_at: new Date(), updated_at: new Date()},
    { id: 6, descricao: 'Brinquedos', created_at: new Date(), updated_at: new Date() },
    { id: 7, descricao: 'Moda', created_at: new Date(), updated_at: new Date() },
    { id: 8, descricao: 'Bebê' , created_at: new Date(), updated_at: new Date()},
    { id: 9, descricao: 'Games', created_at: new Date(), updated_at: new Date() },
  ]);
}
