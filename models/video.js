"use strict";

module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define("Video", {
    level: DataTypes.STRING,
    url: DataTypes.STRING,
    words: DataTypes.STRING,
    pos_name: DataTypes.STRING,
    userid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Video;
};
