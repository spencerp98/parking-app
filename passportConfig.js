// config/passport.js
				
// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

const mysql = require('./dbcon.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        const sql = "SELECT id, email, password, fname FROM user WHERE id = ?";
        const inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results) {	
			done(error, results[0]);
		});
    });
	

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-register', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		// find a user whose email is the same as the form's email
		// we are checking to see if the user trying to login already exists
		const sql = "SELECT id, email, password FROM user WHERE email = ?";
		const inserts = [email];
        mysql.pool.query(sql, inserts, function(error ,results){
			console.log(results);
			console.log("above row object");
			if (error) {
                return done(error);
			}
			if (results.length) {
                return done(null, false, req.flash('signupMessage', 'There is already an account for that email address.'));
            }
            else {
				// if there is no user with that email
                // create the user
                let newUserMysql = new Object();
				
				newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model
			
				const insertQuery = "INSERT INTO user ( email, password, fname, lname ) values (?,?,?,?)";
				const insertInserts = [email, password, req.body.fname, req.body.lname];
				console.log(insertQuery);
				mysql.pool.query(insertQuery, insertInserts, function(error, results){
				    if(error){
				        return done(error);
				    }
				    newUserMysql.id = results.insertId;
				
				    return done(null, newUserMysql);
				});	
            }	
		});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        const sql = "SELECT id, email, password FROM `user` WHERE `email` = ?";
        const inserts = [email];
        mysql.pool.query(sql, inserts,function(error, results){
			if (error) {
                return done(error);
			}
			if (!results.length) {
                return done(null, false, req.flash('loginMessage', 'There is no account associated with the email address you entered.')); // req.flash is the way to set flashdata using connect-flash
            }
			
			// if the user is found but the password is wrong
            if (!( results[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! The password you entered was incorrect.')); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, results[0]);
		
		});
		
    }));

};