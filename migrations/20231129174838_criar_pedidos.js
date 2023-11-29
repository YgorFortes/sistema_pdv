/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.createTableIfNotExists('pedidos', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.integer('cliente_id').notNullable().unsigned();
    tabela.foreign('cliente_id').references('clientes.id');
    tabela.string('observacao',45).notNullable();
    tabela.float('valor_total').notNullable();
    tabela.timestamp('deletedAt').defaultTo(null);
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex)  {
  return knex.schema.dropTableIfExists('pedidos');
};