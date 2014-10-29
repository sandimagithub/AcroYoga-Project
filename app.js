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

//routes to the different levels to show associated videos
app.get("/selection/level/:level", function(req,res){
  var levelSelected = parseInt(req.params.level, 10);

  if (levelSelected === 1) {
   res.render("level_one.ejs");
  } else if (levelSelected === 2) {
    res.render("level_two.ejs");
  } else if (levelSelected === 3) {
    res.render("level_three.ejs");
  } else if (levelSelected === 0) {
    res.render("therapeutic.ejs");
  
  }
});



//In the post route for user authentication form, we use Passport:
app.post("/login", passport.authenticate("local", {
    successRedirect: "/selection",
    failureRedirect: "/index"
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
app.get("/selection/:id/videos", function(req, res) {
    var selectionId = parseInt(req.params.id, 10);
    models.video.findAll(
    { where: { user_id: selectionId } }
  ).then(function(video) {
    res.render('videos', { 
      video: video,
      selectionId: selectionId,
      messages: req.flash('info') //when there is an error, we want to render it to the page
       });
  });
});

// //this is the route to post new videos into DB
// app.post("/videos", function(req, res) {
//   models.Video.create({
//     level: req.body.level,
//     url: req.body.url,
//     words: req.body.words
//     posname:req.posname
//      // a post request is being sent to this route, the handler is invoked
//   }).then(function(manager) { 
//     res.redirect('/managers'); 
//   }, function(error){ // this is the failure call back function
//     req.flash('info', error); //this tells the session to remember the error, under the key 'info' (this sets the error object in the flash)
//     res.redirect('/managers'); // we tell express to send a redirect message back to the browser 

//   });
// });

// //this is the route to post new tenants to the DB associated with that manager

// app.post("/managers/:id/tenants", function(req,res){
//   var managerId = parseInt(req.params.id, 10), //you want to tell parseInt what base you are in.  In this case, we are in the base 10 of that number
//     path = ["/managers/", managerId, "/tenants"].join(''), //now use the join function to join the strings together
//     tenant =  models.Tenant.build({
//           firstname: req.body.firstname,
//           lastname: req.body.lastname
//           });
  
//   //Promise libraries allow you to write cleaner code if you have a lot of nested functions

//   models.Manager
//     .find(managerId) //find the manager with managerId, the result of .find accesses a promise in sequelize
//     .then(function(manager){
//       manager.addTenant(tenant) //then add tenant to found manager
//       .catch(function(error) { // catch any errors and set the flash message
//           req.flash('info', error);//this tells the session to remember the error, under the key 'info' (this sets the error object in the flash)
//             })
//           .finally(function() { //finally redirect to the path
//             res.redirect(path);
//              });
//         });

//     });







app.listen(process.env.PORT || 3000);



























