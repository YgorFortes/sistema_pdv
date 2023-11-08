/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.createTableIfNotExists('produtos', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.string('descricao', 45).notNullable();
    tabela.integer('quantidade_estoque').notNullable();
    tabela.float('valor').notNullable();
    tabela.integer('categoria_id').notNullable().unsigned();
    tabela.foreign('categoria_id').references('categorias.id').onUpdate('CASCADE');
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex)  {
  return knex.schema.dropTable('produtos');
};

