'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('variants', [
      {
        variant_id: 'standard',
        variant_name: 'Standard',
      },
      {
        variant_id: 'chess960',
        variant_name: 'Chess960',
      },
      {
        variant_id: 'kingOfTheHill',
        variant_name: 'King of the Hill',
      },
      {
        variant_id: 'threeCheck',
        variant_name: 'Three-check',
      },
      {
        variant_id: 'antichess',
        variant_name: 'Antichess',
      },
      {
        variant_id: 'atomic',
        variant_name: 'Atomic',
      },
      {
        variant_id: 'horde',
        variant_name: 'Horde',
      },
      {
        variant_id: 'racingKings',
        variant_name: 'Racing Kings',
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('variants', null, {});
  }
};