const { BaseRepository } = require("@cubos/knex-repository");

exports.up = async function (knex) {
  await BaseRepository.alterTable(knex, "posts", (table) => {
    table.text("description").alter();
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, "posts");
};
