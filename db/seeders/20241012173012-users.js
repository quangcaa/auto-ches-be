'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'lucian123',
        email: 'lucian123123@gmail.com',
        password: '$2a$12$RII1qf4Sm.FjobMJ0IzlYuUiCf8QdrBHgqyvInwxHclUMSC4NT.VC',
        joined_date: new Date(),
        refresh_token: null,
        role: 'user'
      },
      {
        username: 'lucian234',
        email: 'lucian234234@gmail.com',
        password: '$2a$12$eoGfe8LmhtF9kr5nBMm.MOPE/beTQgJRx6NLGYAyBt.C2ei7JA7dG',
        joined_date: new Date(),
        refresh_token: null,
        role: 'user'
      },
      {
        username: 'bot',
        email: 'bot@gmail.com',
        password: '$2a$12$eoGfe8LmhtF9kr5nBMm.MOPE/beTQgJRx6NLGYAyBt.C2ei7JA7dG',
        joined_date: new Date(),
        refresh_token: null,
        role: 'user'
      },
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: '$2a$12$eoGfe8LmhtF9kr5nBMm.MOPE/beTQgJRx6NLGYAyBt.C2ei7JA7dG',
        joined_date: new Date(),
        refresh_token: null,
        role: 'admin'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
