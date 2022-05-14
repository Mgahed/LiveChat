const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {transporter} = require('../util/mailer');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup'
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              const mailOptions = {
                from: 'The Idea project',
                to: email,
                subject: 'My first Email!!!',
                html: "<h1 style='color:red'>This is my first email. I am so excited!</h1>"
              };
              res.redirect('/');
              /*return transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  res.json(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });*/
            });
          }
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: {items: []}
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
        });
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
