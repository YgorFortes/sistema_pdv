/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.alterTable('produtos', function(table) {
    table.string('produto_imagem',500).defaultTo(null);
  });
};

export function down (knex) {
  return knex.schema.table('produtos', function(table) {
    table.dropColumn('produto_imagem');
  });
};
