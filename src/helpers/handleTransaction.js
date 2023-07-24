const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

async function generateTransaction() {
  // eslint-disable-next-line no-return-await
  return await knex.transaction();
}

module.exports = { generateTransaction };
