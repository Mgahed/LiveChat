const path = require('path');
require('dotenv').config();
const moment = require('moment')

const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/ErrorController');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const webRoutes = require('./routes/web');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.moment = require('moment');
  res.locals.currentUser = req.user;
  next();
});

app.use(webRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    server.listen(PORT, () => {
      console.log('Server started on ' + HOST + ':' + PORT);

      io.on('connection', function (socket) {
        console.log("USER CONNECTED...");
        // handle new messages
        socket.on('new:message', function (msgObject) {
          io.emit('new:message', msgObject);
        });
      });
    });

  })
  .catch(err => {
    console.log(err);
  });
