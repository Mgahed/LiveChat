const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.get('/logout', authController.postLogout);

module.exports = router;