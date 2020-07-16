const User = require("../models/users");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');
//const nodemailer = require('../config/nodemailer');
const nodemailer = require('nodemailer');
const async = require('async');
const { route } = require("../routes/users");
const router = require("../routes/users");
const env = require('../config/environment');

module.exports.profile = function (req, res) {
  return res.render("profile", {
    title: "Profile Page",
  });
};

module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signin", {
    title: "Sign In Page",
  });
};

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signup", {
    title: "Sign Up Page",
  });
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user durng signup: " + err);
      return res.redirect("back");
    }
    if (!user) {
      User.create(req.body, function (err, newUser) {
        if (err) {
          console.log("Error in creating new user during sign up: " + err);
          return res.redirect("back");
        }
        return res.redirect("/users/signin");
      });
    } else {
      return res.redirect("back");
    }
  });
};

module.exports.create_session = function (req, res) {
  req.flash("success", "Logged in succesfully");
  //console.log(req.locals.user);
  return res.redirect("/users/profile");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "You have logged out");
  return res.redirect("/");
};

module.exports.uploadImage = function (req, res) {
  //req.flash('success', 'Image uploaded successfully');
  return res.render("forms", {
    title: "Upload Image",
  });
};

module.exports.imageUploaded = function (req, res) {
  //req.flash('success', 'Image uploaded successfully');
  User.findById(req.user.id, function (err, user) {
    if (err) {
      console.log("Error in finding user: " + err);
      return;
    }
    User.uploadedImage(req, res, function (err) {
      if (err) {
        console.log("Error in multer: " + err);
        req.flash("error", "Image upload failed");
        return;
      }
      if (req.file) {
        user.uploads.push(User.uploadsPath + "/" + req.file.filename);
        user.save();
      }
    });
  });
  req.flash("success", "Image uploaded successfully");
  return res.redirect("/users/profile");
};

module.exports.description = function (req, res) {
  return res.render("description", {
    title: "Description Page",
  });
};

module.exports.list = function (req, res) {
  //console.log(req.params);
  //console.log(req.body);
  const directoryPath = path.join(__dirname, "../assets/images");
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    return res.render("list", {
        title: "List Page",
        form: req.body,
        image_list : files
      });
  });
};

module.exports.edit = function(req, res) {
  return res.render('edit', {
    'title' : 'Edit profile'
  })
}

module.exports.update = function(req, res) {
  //return res.redirect('/users/profile');
  console.log(req.params.id);
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    if (err) {
      console.log('Error in updating user');
      return;
    }
    return res.redirect('/users/profile');
  })
}

module.exports.forgot_password = function(req, res) {
  return res.render('forgot_password', {
    'title' : 'Forgot Password'
  });
}

module.exports.reset_password = function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    }, function(token, done) {
      User.findOne({email : req.body.email}, function(err, user) {
        if (err) {
          console.log('Error in finding user in forget password: '+err);
          return;
        }
        if (!user) {
          req.flash('No account with that email');
          return res.redirect('back');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 300000;
        user.save(function(err) {
          done(err, token, user);
        });
      });
    }, function(token, user, done) {
      var smtpTransport = nodemailer.createTransport(env.smtp);
      var mailOptions = {
        to : user.email,
        from : 'soumyadeepsp@gmail.com',
        subject : 'Insectify Password Reset',
        text : 'You are receiving this because you (or someone else) have requested to reset'+
        ' the password of the Insectify account linked with this email id.' + 
        ' Please click on the following link to reset your password' + '\n\n' + 
        'http://'+req.headers.host+'/users/reset/'+token+'\n\n'+
        'If you did not request this, please ignore the mail and your password will remain unchanged.'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
          console.log('error in sending mail: '+err);
          return;
        }
        console.log('mail sent');
        req.flash('success', 'An email has been sent to '+user.email);
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      console.log('Error in sending mail: '+err);
      return next(err);
    }
    return res.redirect('/users/forgot_password');
  });
}

module.exports.reset = function(req, res) {
  User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires : {$gt : Date.now()}}, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or expired');
      return res.redirect('/users/forgot');
    }
    return res.render('reset_password', {
      'token' : req.params.token,
      'title' : 'Reset Password'
    });
  });
}

module.exports.reset_done = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({resetPasswordToken : req.params.token, resetPasswordExpires : {$gt : Date.now()}}, function(err, user) {
        if (err) {
          console.log('Error in finding user while resetting password: '+err);
          return;
        }
        if (!user) {
          req.flash('error', 'Password reset token is invalid or is expired');
          return res.redirect('back');
        }
        if (req.body.password == req.body.confirm_password) {
          let id = user._id;
          console.log(id);
          User.findByIdAndUpdate({_id : id}, {password : req.body.password}, function(err) {
            if (err) {
              console.log('Error in updating password: '+err);
              return;
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function(err) {
              if (err) {
                console.log('Error in saving new password: '+err);
                return;
              }
              req.logIn(user, function(err) {
                if (err) {
                  console.log('Error in logging in after changing password: '+err);
                  return;
                }
                done(err, user);
              });
            });
          });
        } else {
          req.flash('error', 'Passwords do not match');
          return res.redirect('back');
        }
      });
    }, function(user, done) {
      var smtpTransport = nodemailer.createTransport(env.smtp);
      var mailOptions = {
        to : user.email,
        from : 'soumyadeepsp@gmail.com',
        subject : 'Your password has been changed',
        text : 'Hello, this is a confirmation mail that your password has been successfully changed'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
          console.log('Error in sending password change confirmation mail :'+err);
          return;
        }
        req.flash('success', 'Your password has been changed successfully!');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/users/profile');
  })
}