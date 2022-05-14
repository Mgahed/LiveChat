const User = require('../models/user');
const Chat = require('../models/chat');

exports.getIndex = (req, res, next) => {
  // get all users
  User.find({_id: {$ne: req.user._id}})
    .then(users => {
      res.render('index', {
        pageTitle: 'Chat',
        path: '/',
        users: users,
        receiver: null,
        chat: null,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getChat = (req, res, next) => {
  // get chat where sender = req.user._id and receiver = req.params.userId
  Chat.find({
    $or: [
      {sender: req.user._id, receiver: req.params.userId},
      {sender: req.params.userId, receiver: req.user._id}
    ]
  })
    .sort({createdAt: 1})
    .then(chat => {
      //get all users except the current user
      User.find({_id: {$ne: req.user._id}})
        .then(users => {
          // get user
          User.findById(req.params.userId)
            .then(user => {
              res.render('index', {
                pageTitle: 'Chat with ' + user.name,
                path: '/chat',
                chat: chat,
                receiver: user,
                users: users,
                user: req.user,
              });
            })
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// post chat
exports.postChat = (req, res, next) => {
  const chat = new Chat({
    sender: req.user._id,
    receiver: req.body.receiver,
    message: req.body.message,
  });
  if (req.body.sender.toString() === req.user._id.toString()) {
    chat.save()
      .then(result => {
        // res.redirect('/chat/' + req.body.receiver);
        res.json({
          ok: true,
          message: 'Chat sent successfully',
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    res.json({
      ok: false,
      message: 'You are not authorized to send this message',
    });
  }
};