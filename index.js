const express = require('express');
const port = 8000;
const path = require('path');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMWare = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const env = require('./config/environment');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.assets_path));
app.use(expressLayouts);
app.use('/assets/uploads', express.static(__dirname+'/assets/uploads'));
app.use(session({
    name : 'ConnectI',
    secret : env.session_cookie_key,
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000*60*100)
    },
    store : new mongoStore({
            mongooseConnection : db,
            autoRemove : 'disabled'
    },
    function(err) {
        if (err) {
            console.log('Errr in using mongo store to store the session cookies');
            return;
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMWare.setFlash);
app.use(morgan(env.morgan.mode, env.morgan.options));
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log('Error in running the server in port: '+err);
        return;
    }
    console.log('Server is running perfectly fine on port: '+port);
});