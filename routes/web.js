const express = require('express');

const mgahedController = require('../controllers/MgahedController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, mgahedController.getIndex);

router.get('/chat/:userId', isAuth, mgahedController.getChat);

router.post('/chat', isAuth, mgahedController.postChat);

module.exports = router;