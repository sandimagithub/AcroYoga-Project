"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Videos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      level: {
        type: DataTypes.STRING
      },
      url: {
        type: DataTypes.STRING
      },
      words: {
        type: DataTypes.STRING
      },
      pos_name: {
        type: DataTypes.STRING
      },
      userid: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Videos").done(done);
  }
};