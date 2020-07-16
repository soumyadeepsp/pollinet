const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/usersController');

router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/signin', usersController.signin);
router.get('/signup', usersController.signup);
router.post('/create', usersController.create);
router.post('/create_session', passport.authenticate(
    'local', {
        failureRedirect : '/users/signin'
    },
), usersController.create_session);
router.get('/signout', usersController.destroySession);
router.get('/upload', passport.checkAuthentication, usersController.uploadImage);
router.post('/submit_photo', passport.checkAuthentication, usersController.imageUploaded);
router.post('/list', usersController.list);
router.get('/list', usersController.list);
router.get('/description', usersController.description);
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect : '/users/signin'}), usersController.create_session);
router.get('/edit', passport.checkAuthentication, usersController.edit);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/forgot_password', usersController.forgot_password);
router.post('/forgot_password', usersController.reset_password);
router.get('/reset/:token', usersController.reset);
router.post('/reset/:token', usersController.reset_done);

module.exports = router;