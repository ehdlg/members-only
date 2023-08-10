const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Home' });
});

router.get('/register', userController.user_create_get);

router.post('/register', userController.user_create_post);

router.get('/login', userController.user_login_get);

router.post('/login', userController.user_login_post);

module.exports = router;
