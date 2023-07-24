const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');
const { addTime } = require('../helpers/handleDate');

class UserRepository extends BaseRepository {
  constructor() {
    super(knex, 'users');
  }

  async getUsers() {
    const users = await
      knex('users as u')
        .select(
          'u.id',
          'u.firstName',
          'u.lastName',
          'u.userName',
          'u.email',
          'u.birthdate',
          'u.avatar',
          'u.phone',
          'u.userType',
          'u.isActive',
        )
        .where('u.deletedAt', null)
        .returning('*');
    return users;
  }

  async getAdmins() {
    const admins = await
      knex('users as u')
        .select(
          'u.id',
          'u.firstName',
          'u.lastName',
          'u.userName',
          'u.email',
          'u.birthdate',
          'u.avatar',
          'u.phone',
          'u.userType',
          'u.isActive',
        )
        .where('u.userType', 'Admin')
        .returning('*');
    return admins;
  }

  async getUsersAssociatesWithEmail(email) {
    const users = await
      knex('users')
        .select('userName')
        .where({ email })
        .andWhere('userType', '!=', 'Admin')
        .andWhere('userType', '!=', 'Super Admin')
        .returning('*');

    return users;
  }

  async getUsersFiltereds(filterParams, page, pageSize) {
    const {
      lookupTable,
      isActive,
      deletedAt,
      isRejected,
    } = filterParams;

    delete filterParams.lookupTable;

    page = page || 1;
    pageSize = pageSize || 8;

    let initialDate = null;
    let finalDate = null;

    if (deletedAt) {
      initialDate = new Date(deletedAt);
      finalDate = addTime(new Date(deletedAt), { days: 1 });
    }

    const rowCount = await knex('users as u')
      .innerJoin(`${lookupTable} as lt`, 'u.id', 'lt.userId')
      .leftJoin('plans as p', 'lt.planId', 'p.id')
      .leftJoin('credits as c', 'c.userId', 'lt.userId')

      .where((builder) => {
        if (isActive) {
          builder.where('u.isActive', isActive);
        }
        if (deletedAt) {
          builder
            .where('deletedAt', '>=', initialDate)
            .andWhere('deletedAt', '<', finalDate);
        } else {
          builder.whereNull('deletedAt');
        }
        if (isRejected === 'true') {
          builder.whereNotNull('rejectedAt');
        }
        if (isRejected === 'false') {
          builder.whereNull('rejectedAt');
        }
      })
      .count('*');

    const { count } = rowCount[0];

    const numberOfPages = count / pageSize;

    const users = await
      knex('users as u')
        .innerJoin(`${lookupTable} as lt`, 'u.id', 'lt.userId')
        .leftJoin('plans as p', 'lt.planId', 'p.id')
        .leftJoin('credits as c', 'c.userId', 'lt.userId')
        .select(
          'u.id',
          'u.userType',
          'u.firstName',
          'u.lastName',
          'u.userName',
          'u.phone',
          'u.email',
          'u.avatar',
          'u.birthdate',
          'u.isActive',
          'c.balance as credits',
          'lt.*',
          'u.deletedAt',
          'p.name as plan',
        )
        .where((builder) => {
          if (isActive) {
            builder.where('u.isActive', isActive);
          }
          if (deletedAt) {
            builder
              .where('deletedAt', '>=', initialDate)
              .andWhere('deletedAt', '<', finalDate);
          } else {
            builder.whereNull('deletedAt');
          }
          if (isRejected === 'true') {
            builder.whereNotNull('rejectedAt');
          }
          if (isRejected === 'false') {
            builder.whereNull('rejectedAt');
          }
        })
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .returning('*');

    users.currentPage = parseInt(page, 10);
    users.totalPages = numberOfPages >= 1 ? numberOfPages : 1;

    return users;
  }

  async getAdminsFiltereds(filterParams, page, pageSize) {
    const {
      isActive,
      deletedAt,
    } = filterParams;

    page = page || 1;
    pageSize = pageSize || 8;

    let initialDate = null;
    let finalDate = null;

    if (deletedAt) {
      initialDate = new Date(deletedAt);
      finalDate = addTime(new Date(deletedAt), { days: 1 });
    }

    const rowCount = await knex('users as u')
      .where((builder) => {
        if (isActive) {
          builder.where({ isActive });
        }
        if (deletedAt) {
          builder
            .where('deletedAt', '>=', initialDate)
            .andWhere('deletedAt', '<', finalDate);
        } else {
          builder.whereNull('deletedAt');
        }
        builder.where('userType', 'Admin');
      })
      .count('*');

    const { count } = rowCount[0];

    const numberOfPages = count / pageSize;

    const users = await
      knex('users')
        .select(
          'id',
          'userType',
          'firstName',
          'lastName',
          'userName',
          'phone',
          'email',
          'createdAt',
          'deletedAt',
          'isActive',
          'birthdate',
          'avatar',
        )
        .where((builder) => {
          if (isActive) {
            builder.where({ isActive });
          }
          if (deletedAt) {
            builder
              .where('deletedAt', '>=', initialDate)
              .andWhere('deletedAt', '<', finalDate);
          } else {
            builder.whereNull('deletedAt');
          }
          builder.where('userType', 'Admin');
        })
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .returning('*');

    users.currentPage = parseInt(page, 10);
    users.totalPages = numberOfPages >= 1 ? numberOfPages : 1;

    return users;
  }

  async getExternalUserInformation(searchParameters) {
    let searchInfo = false;
    const { userId, userType } = searchParameters;

    switch (userType) {
      case 'Student':
        searchInfo = {
          tableSearch: 'students',
          noCreditsSelect: ['cpf', 'name as plan'],
          creditsSelect: ['cpf', 'name as plan', 'balance'],
        };
        break;

      case 'Teacher':
        searchInfo = {
          tableSearch: 'teachers',
          noCreditsSelect: ['cnpj', 'availability', 'category', 'languages', 'additionalInfo', 'name as plan'],
          creditsSelect: ['cnpj', 'availability', 'category', 'languages', 'additionalInfo', 'name as plan', 'balance'],
        };
        break;

      default:
        searchInfo = false;
    }

    if (searchInfo) {
      let user;

      user = await knex(`${searchInfo.tableSearch} as t`)
        .where('t.userId', userId)
        .innerJoin('plans as p', 't.planId', 'p.id')
        .innerJoin('credits as c', 'c.userId', 't.userId')
        .select(searchInfo.creditsSelect)
        .first();

      if (!user) {
        user = await knex(`${searchInfo.tableSearch} as t`)
          .where('t.userId', userId)
          .innerJoin('plans as p', 't.planId', 'p.id')
          .select(searchInfo.noCreditsSelect)
          .first();
      }

      return user;
    }
  }
}
module.exports = { UserRepository };
