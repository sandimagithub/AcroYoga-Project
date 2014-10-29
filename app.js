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

//signup form route
app.get("/", function(req, res) {
	res.render("index.ejs");
});

//signup new user route
app.post("/newuser", function(req, res){
	models.User.createNewUser({ 
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		username:req.body.username,
		password:req.body.password,
		email:req.body.email
	});
});

//Login form routes, when a user already has a username and password
app.get("/", function(req, res){
	res.render("index.ejs");
});

app.get("/selection", function(req, res){
  res.render("selection.ejs");
});

//In the post route for user authentication form, we use Passport:
app.post("/login", passport.authenticate("local", {
    successRedirect: "/selection",
    failureRedirect: "/index"
}));

//home route, when successfully logged in, it will route them to selection page
app.get("/index.ejs", function(req, res){
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) { 
      models.User.findAll().then(function(users) { 
        res.render("selection.ejs", {
          isAuthenticated: req.isAuthenticated(), 
          userInfo: req.user,
          users: users, 
          messages: req.flash('info')
          })
      }) 
  } else { 
    res.redirect("/index.ejs", {
      isAuthenticated: false
    }); 
        } 
    }); 

app.listen(process.env.PORT || 3000);



























