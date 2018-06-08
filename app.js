//set up express app
const express = require("express");
const app = express();

//set up modules
const bodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(CookieParser());
app.use(flash());

//set up authentication
const passport = require("passport");
const passportConfig = require("./passportConfig.js");
passportConfig(passport);

//set up database connection
const mysql = require("./dbcon.js");
app.set("mysql", mysql);

//set up template engine
const handlebars = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: "2o4i3btlkj25btgf",
    name: "cookie",
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());


/****************************************************************************************
 * *********************Functions for interacting with database**************************
 * *************************************************************************************/

//This function will pull all of the spots from the database associated with the current user
function getParkingHistory(res, mysql, context, complete) {
    // todo: week 1
}

//This function will return the currently active parking spot from the database
function getCurrentSpot(req, res, mysql, context, complete) {
    let sql = "SELECT id, latitude, longitude, `date` FROM parkingSpot INNER JOIN (SELECT MAX(`id`) as maxId FROM parkingSpot WHERE user_id = (?)) mt ON id = mt.maxId";
    let inserts = [req.user.id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.parkingSpot = results[0];
        complete();
    });
    
    
}

//This function inserts a new parking spot into the database
function insertNewSpot(req, mysql, complete) {
    let sql = "INSERT INTO parkingSpot (latitude, longitude, favorite, date, user_id) VALUES (?,?,?,?,?)";
    let inserts = [req.body.lat, req.body.lng, 0, req.body.date, req.user.id];
    mysql.pool.query(sql, inserts, complete);
}



/****************************************************************************************
 * ***********************************Route Handlers*************************************
 * *************************************************************************************/

//The root address will either open the home page or take the user to the login page if
//they are not already logged in.
app.get("/", function(req, res){
    let context = {};
    
    //if the user is logged in display the home page
    if(req.user){
        context.user = {};
        context.user.fname = req.user.fname;
        res.render("home", context);
    }
    
    //if the user is not logged in display the login page
    else{
        res.render("login");
    }
});


//login page
app.get("/login", function(req, res){
    let context = {};
    context.message = req.flash("loginMessage");
    res.render("login", context);
});


//login post handler. Uses passport.js for authentication
app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })
);


//registration page
app.get("/register", function(req, res){
    let context = {};
    context.message = req.flash("signupMessage");
    res.render("register", context);
});


//registration post handler. Uses passport.js for authentication
app.post("/register", passport.authenticate("local-register", {
        successRedirect: "/",
        failureRedirect: "/register",
        failureFlash: true
    })
);


//log the user out and redirect to login page
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});


//This will show the results of logging a parking spot. This page also gives the user
//the option to add notes and pictures
app.post("/nav", function(req, res){
    let callbackCount = 0;
    insertNewSpot(req, mysql, complete);
    
    function complete(){
        callbackCount++;
        if(callbackCount <= 1){
            res.redirect('/nav');
        }
    }
});


//This route will show the navigation page to the currently active spot.
app.get("/nav", function(req, res){
    let callbackCount = 0;
    let context = {};
    
    getCurrentSpot(req, res, mysql, context, complete);
    
    function complete(){
        callbackCount++;
        if(callbackCount <= 1){
            res.render('navigation', context);
        }
    }
});


//Route for parking history
app.get("/history", function(req, res){
    // todo: week 1
});


//Route for parking spot details
//parameters:
//  id - The id for the database entry for the parking spot
app.get("spot/:id", function(req,res){
    // todo: week 2
});


//Route for settings
app.get("/settings", function(req, res){
    
});


//404 error handler
app.use(function(req, res){
    res.status(404);
    res.render("404");
});


//500 error handler
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type("plain/text");
    res.status(500);
    res.render("500");
});


//start running app
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express started; press Ctrl-C to terminate.");
});