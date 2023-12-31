/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.createTableIfNotExists('categorias', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.string('descricao', 45).notNullable();
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex)  {
  return knex.schema.dropTable('categorias');
};
