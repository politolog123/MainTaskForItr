'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FieldValue', {
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Items', key: 'id' },
        onDelete: 'CASCADE'
      },
      // fieldId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: { model: 'ItemField', key: 'id' },
      //   onDelete: 'CASCADE'
      // },
      value: {
        type: Sequelize.TEXT
      }
    }, {
      timestamps: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
