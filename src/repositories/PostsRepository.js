const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);

const { BaseRepository } = require("@cubos/knex-repository");

class PostRepository extends BaseRepository {
  constructor() {
    super(knex, "posts");
  }
}
module.exports = { PostRepository };
