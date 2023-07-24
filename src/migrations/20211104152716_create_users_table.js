const { BaseRepository } = require("@cubos/knex-repository");

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, "users", (table) => {
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("nickname").notNullable();
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, "users");
};
