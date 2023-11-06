/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
  return knex.schema.createTable('usuarios', (tabela)=> {
    tabela.increments('idusuarios').primary().notNullable();
    tabela.string('nome',45).notNullable();
    tabela.string('email', 255).notNullable().unique();
    tabela.string('senha',255).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex){
  return knex.schema.dropTable('usuarios');
};
