"use strict";


//putting model logic in the model folder.

var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var passport = require("passport"),
    localStrategy = require("passport-local").Strategy;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },

      hashPass: function(password){ //we created a function that hashes the password that we pass into it
        return bcrypt.hashSync(password, salt); //this syntax found in the bycrypt module documentation --we are putting the hash into our DB
      },

      comparePass: function(userpass, dbpass){
        console.log("user pass and dbpass:", userpass, dbpass);
        return bcrypt.compareSync(userpass, dbpass);//this syntax found in the bycrypt module documentation --we are comparing the user's password to the one stored in DB
      }, 

      createNewUser: function(userInfo) {//passing in the object with our new user information--referring to the object and key, related to the name in the DB
          User.create({
            first_name:userInfo.firstname,
            last_name:userInfo.lastname, 
            username:userInfo.username,
            password:User.hashPass(userInfo.password)
          });
    }
    }
  });

  passport.use(new localStrategy({ //new instance of passport 
    usernameField: 'username', //usernameField and passwordField are passport specific...you have to use those words
    passwordField: 'password' //username and password are from your "name" attributes in your <form> field, in your ejs file.
  }, function(username, password, passFinished) {
    User.find({
      where: {
        username: username
      }
    }).done(function (error, user) {
      if (user) {
        if (User.comparePass(password, user.password)) {
          passFinished(null, user);
        } else {
          console.log("Passwords don't match");
          passFinished(null, null);
        }
      } else {
        console.log("No user was even found");
        passFinished(null, null);
      }
    });
  }));

  return User;
};