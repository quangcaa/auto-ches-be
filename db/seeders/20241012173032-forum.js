'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('forum', [
      {
        category_id:'GCD',
        category_name: 'General Chess Discussion',
        category_description: 'The place to discuss general chess topics',
      },
      {
        category_id:'AF',
        category_name: 'Autochess Feedback',
        category_description: 'Bug reports, feature requests, suggestions',
      },
      {
        category_id:'GA',
        category_name: 'Game analysis',
        category_description: 'Show your game and analyse it with the community',
      },
      {
        category_id:'OTD',
        category_name: 'Off-Topic Discussion',
        category_description: 'Everything that isn\'t related to chess',
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('forum', null, {});
  }
};
