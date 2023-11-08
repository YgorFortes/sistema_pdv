/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex)  {
  return knex.schema.table('categorias', function(table) {
    table.timestamp('deletedAt').defaultTo(null);
  });
};

export function down (knex) {
  return knex.schema.table('categorias', function(table) {
    table.dropColumn('deletedAt');
  });
};
