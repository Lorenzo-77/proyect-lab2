const express = require('express');
const passport = require('passport');

const { isLoggedIn } = require('../lib/auth');
const routerLogin = express.Router();

routerLogin.get('/login', (req, res) => {
  res.render('login/ingreso');
});
routerLogin.post('/auth', (req, res, next) =>{
  passport.authenticate('local.auth', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })(req, res, next);
})

routerLogin.get('/register', (req, res) => {
  res.render('login/register');
});
routerLogin.post('/register', passport.authenticate('local.registrate', {
    successRedirect: '/profile',
    failureRedirect: '/register',
  }));

  routerLogin.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/login");
    });
  });

routerLogin.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');//res.render('crear/profileCoordinador') testing
  });

module.exports = routerLogin;
