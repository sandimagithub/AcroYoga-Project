var express = require('express'),
    pg = require("pg"),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    bcrypt = require("bcrypt"),//encryption module using the blowfish a
    app = express(), //fires up new instance of express
    models = require('./models/index'),
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
	models.User.createNewUser({ //left hand is the model, right hand is the information passed from body 
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		username:req.body.username,
    emailaddress:req.body.emailaddress,
    password:req.body.password
		
	});
  res.redirect("/selection")
});

//Login form routes, when a user already has a username and password
// app.get("/", function(req, res){
// 	res.render("index.ejs");
// });

// app.get("/selection", function(req, res){
//   res.render("selection.ejs");
// });

//routes to the different levels to show associated videos
app.get("/selection/level/:level", function(req,res){ //this is our DB pull to get all from the Video model
  var levelSelected = parseInt(req.params.level, 10);

  models.Video.findAll({
    where: { 
        level: req.params.level
    }
  }).then(function(videos) {//whatever is passed down all from the findAll in DB is an array of video objects 
  //we need to use the template to put the array of video objects here
    if (levelSelected === 1) {
     res.render("level_one.ejs", {
      allVideos:videos // this will put appropriate videos per selected level
     });
    } else if (levelSelected === 2) {
      res.render("level_two.ejs", {
      allVideos:videos
     });
    } else if (levelSelected === 3) {
      res.render("level_three.ejs", {
      allVideos:videos
     });
    } else if (levelSelected === 0) {
      res.render("therapeutic.ejs", {
      allVideos:videos
     });
    }
  });
});

//In the post route for user authentication form, we use Passport:
app.post("/login", passport.authenticate("local", {
    successRedirect: "/selection",
    failureRedirect: "/"
}));

//home route, when successfully logged in, it will route them to selection page
app.get("/selection", function(req, res){
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
    res.redirect("/", {
      isAuthenticated: false
    }); 
        } 
    }); 

//this is the route to get all the videos associated with that level
app.get("/selection/level/:level", function(req,res){
    var selectionId = parseInt(req.params.id, 10);
    models.Video.findAll(
    { where: { level: selectionId } }
  ).then(function(levels) {
    res.render('/selection/level/:id', { 
      video: levels,
      selectionId: selectionId,
      messages: req.flash('info') //when there is an error, we want to render it to the page
       });
  });
});

//logout route
app.get("/logout", function(req, res){
  //calling the logout function from passport appended in the req object 
  req.logout(); // destroys the session for us when we log out
  res.redirect("/");
});

//this is the route to post new videos (levels) into DB
app.post("/selection", function(req, res) {
  models.Video.create({
    level: req.body.level,
    url: req.body.url,
    words: req.body.words,
    pos_name:req.body.posname
     // a post request is being sent to this route, the handler is invoked
  }).then(function(level) { 
    res.redirect('/selection'); 
  }, function(error){ // this is the failure call back function
    req.flash('info', error); //this tells the session to remember the error, under the key 'info' (this sets the error object in the flash)
    res.redirect('/'); // we tell express to send a redirect message back to the browser 

  });
});


app.listen(process.env.PORT || 3000);



























