'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('timecontrols', [
      {
        time_control_id: 'Bu1',
        time_control_type: 'Bullet',
        minutes_per_side: 1,
        increment_in_seconds: 0,
      },
      {
        time_control_id: 'Bu2',
        time_control_type: 'Bullet',
        minutes_per_side: 2,
        increment_in_seconds: 1,
      },
      {
        time_control_id: 'Bl1',
        time_control_type: 'Blitz',
        minutes_per_side: 3,
        increment_in_seconds: 0,
      },
      {
        time_control_id: 'Bl2',
        time_control_type: 'Blitz',
        minutes_per_side: 3,
        increment_in_seconds: 2,
      },
      {
        time_control_id: 'Bl3',
        time_control_type: 'Blitz',
        minutes_per_side: 5,
        increment_in_seconds: 0,
      },
      {
        time_control_id: 'Bl4',
        time_control_type: 'Blitz',
        minutes_per_side: 5,
        increment_in_seconds: 3,
      },
      {
        time_control_id: 'Ra1',
        time_control_type: 'Rapid',
        minutes_per_side: 10,
        increment_in_seconds: 0,
      },
      {
        time_control_id: 'Ra2',
        time_control_type: 'Rapid',
        minutes_per_side: 10,
        increment_in_seconds: 5,
      },
      {
        time_control_id: 'Ra3',
        time_control_type: 'Rapid',
        minutes_per_side: 15,
        increment_in_seconds: 10,
      },
      {
        time_control_id: 'Cl1',
        time_control_type: 'Classical',
        minutes_per_side: 30,
        increment_in_seconds: 0,
      },
      {
        time_control_id: 'Cl2',
        time_control_type: 'Classical',
        minutes_per_side: 30,
        increment_in_seconds: 20,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('timecontrols', null, {});
  }
};