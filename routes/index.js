const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Home' });
});

router.get('/register', userController.user_create_get);

router.post('/register', userController.user_create_post);

module.exports = router;
