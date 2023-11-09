/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.createTableIfNotExists('clientes', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.string('nome',45).notNullable();
    tabela.string('email',255).unique().notNullable();
    tabela.string('cpf',45).unique().notNullable();
    tabela.string('cep',45);
    tabela.string('rua',45);
    tabela.integer('numero');
    tabela.string('bairro',45);
    tabela.string('cidade',45);
    tabela.string('estado',45);
    tabela.timestamp('deletedAt').defaultTo(null);
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex)  {
  return knex.schema.dropTable('clientes');
};
