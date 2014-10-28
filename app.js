var express = require('express'),
    pg = require("pg"),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    bcrypt = require("bcrypt"),//encryption module using the blowfish a
    app = express(), //fires up new instance of express
    // models = require('./models/index'),
    // ejs-locals, for layouts
    engine = require('ejs-locals'),
    session = require('cookie-session'), 
    passport = require("passport"),//modules for use with passport
    localStrategy = require("passport-local").Strategy,
    flash = require('connect-flash');

    
//set up passport to use appropriate middleware
app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  maxage: 3600000
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Passport uses "serialize" functions that allow the module to create session objects from the validated information
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    models.User.find({
        where: {
            id: id
        }
    }).done(function(error,user){
        done(error, user);
    });
});


app.set("view engine", "ejs");

// this is different from setting the view engine
// it enables the layout functionality
app.engine('ejs', engine);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride("_method"));

app.use(express.static(__dirname + '/public'));

//enable the session 
//the session needs a key
//with which to encode the session values
//exposed to us by require('cookie-session')
// app.use(session({
//   keys:['key']
// }));

//enable the flash messages api 
//exposed to us by require('connect-flash')
app.use(flash());