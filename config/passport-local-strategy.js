const User= require('../models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({email : email}, function(err, user) {
            if (err) {
                req.flash('error', err);
                console.log('Error in finding the user --> passport');
                return done(err);
            }
            if (!user || user.password!=password) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log('error in finding user -->  passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user from the session cookie 
        //and we are just sending this to the locals for the view
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;