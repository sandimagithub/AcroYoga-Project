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
      },  postNewVideo: function(videoInfo) {//passing in the object with our new video information--referring to the object and key, related to the name in the DB
          Video.create({
            level:videoInfo.level,
            url:videoInfo.url,
            pos_name:videoInfo.posname,
            words:videoInfo.words,
            userid:videoInfo.userid
            
          });
      }  
      }    
    });

  return Video;
  
};
