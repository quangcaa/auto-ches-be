'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('timecontrols', [
      {
        time_control_id: 'Bu1',
        time_control_type: 'Bullet',
        initial_time: 60,
        increment: 0,
      },
      {
        time_control_id: 'Bu2',
        time_control_type: 'Bullet',
        initial_time: 120,
        increment: 1,
      },
      {
        time_control_id: 'Bl1',
        time_control_type: 'Blitz',
        initial_time: 180,
        increment: 0,
      },
      {
        time_control_id: 'Bl2',
        time_control_type: 'Blitz',
        initial_time: 180,
        increment: 2,
      },
      {
        time_control_id: 'Bl3',
        time_control_type: 'Blitz',
        initial_time: 300,
        increment: 0,
      },
      {
        time_control_id: 'Bl4',
        time_control_type: 'Blitz',
        initial_time: 300,
        increment: 3,
      },
      {
        time_control_id: 'Ra1',
        time_control_type: 'Rapid',
        initial_time: 600,
        increment: 0,
      },
      {
        time_control_id: 'Ra2',
        time_control_type: 'Rapid',
        initial_time: 600,
        increment: 5,
      },
      {
        time_control_id: 'Ra3',
        time_control_type: 'Rapid',
        initial_time: 900,
        increment: 10,
      },
      {
        time_control_id: 'Cl1',
        time_control_type: 'Classical',
        initial_time: 1800,
        increment: 0,
      },
      {
        time_control_id: 'Cl2',
        time_control_type: 'Classical',
        initial_time: 1800,
        increment: 20,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('timecontrols', null, {});
  }
};