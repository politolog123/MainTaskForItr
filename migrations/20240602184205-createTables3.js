'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ItemField', {
      collectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Collections', key: 'id' },
        onDelete: 'CASCADE'
      },
      fieldName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fieldType: {
        type: Sequelize.ENUM('INTEGER', 'STRING', 'TEXT', 'BOOLEAN', 'DATE'),
        allowNull: false
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
