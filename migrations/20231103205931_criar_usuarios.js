/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.createTableIfNotExists('usuarios', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.string('nome',45).notNullable();
    tabela.string('email', 255).notNullable().unique();
    tabela.string('senha',255).notNullable();
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex){
  return knex.schema.dropTable('usuarios');
};
