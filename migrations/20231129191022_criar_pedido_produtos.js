/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.createTable('pedido_produtos', (tabela)=> {
    tabela.increments('id').primary().notNullable();
    tabela.integer('pedido_id').notNullable().unsigned();
    tabela.foreign('pedido_id').references('pedidos.id');
    tabela.integer('produto_id').notNullable().unsigned();
    tabela.foreign('produto_id').references('produtos.id');
    tabela.integer('quantidade_produto').notNullable();
    tabela.float('valor_produto').notNullable();
    tabela.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex)  {
  return knex.schema.dropTable('pedido_produtos');
};