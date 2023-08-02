const { BaseRepository } = require("@cubos/knex-repository");

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, "posts", (table) => {
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("cover").notNullable();
    table.string("author").notNullable();
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, "posts");
};
