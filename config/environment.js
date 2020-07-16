const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval : '1d',
    path : logDirectory
});

const development = {
    name : 'development',
    assets_path : './assets',
    session_cookie_key : 'BlahSomething',
    db : 'insectify_development',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'soumyadeepsp',
            pass : 'atnetbbswgjezmhy'
        }
    },
    google_client_id : '406237353942-emn67vrnsertlpecj8cgeqn7avkva6n1.apps.googleusercontent.com',
    google_client_secret : 'k-9WOabziGguG1F6bi4hsECL',
    google_callback_url : 'http://localhost:8000/users/auth/google/callback',
    morgan : {
        mode : 'dev',
        options : {stream : accessLogStream}
    }
}

const production = {
    name : process.env.INSECTIFY_ENVIRONMENT,
    assets_path : process.env.INSECTIFY_ASSET_PATH,
    session_cookie_key : process.env.INSECTIFY_SESSION_COOKIE_KEY,
    db : process.env.INSECTIFY_DB,
    smtp : {
        service : process.env.INSECTIFY_SERVICE,
        host : process.env.INSECTIFY_HOST,
        port : 587,
        secure : false,
        auth : {
            user : process.env.INSECTIFY_AUTH_USER,
            pass : process.env.INSECTIFY_AUTH_PASS
        }
    },
    google_client_id : process.env.INSECTIFY_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.INSECTIFY_CLIENT_SECRET,
    google_callback_url : process.env.INSECTIFY_GOOGLE_CALLBACK_URL,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogStream}
    }
}

module.exports = eval(process.env.INSECTIFY_ENVIRONMENT) == undefined ? development : eval(process.env.INSECTIFY_ENVIRONMENT);