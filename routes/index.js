const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const {
  isNotAuthenticated,
  isAuthenticated,
  isNotMember,
  checkMessageOwnership,
  isNotAdmin,
} = require('../utils/authentication');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Home' });
});

router.get('/register', isNotAuthenticated, userController.user_create_get);

router.post('/register', isNotAuthenticated, userController.user_create_post);

router.get('/login', isNotAuthenticated, userController.user_login_get);

router.post('/login', isNotAuthenticated, userController.user_login_post);

router.get('/logout', isAuthenticated, userController.user_logout_get);

router.get('/upgrade', isNotMember, userController.user_upgrade_get);

router.post('/upgrade', isNotMember, userController.user_upgrade_post);

router.get('/posts', isAuthenticated, messageController.message_list_get);

router.get('/posts/new', isAuthenticated, messageController.message_new_get);

router.post('/posts/new', isAuthenticated, messageController.message_new_post);

router.get('/posts/:id', isAuthenticated, messageController.message_detail_get);

router.get('/admin', isNotAdmin, userController.user_admin_get);

router.post('/admin', isNotAdmin, userController.user_admin_post);

router.get('/profile', isAuthenticated, userController.user_profile_get);

router.get('/profile/update', isAuthenticated, userController.user_update_get);

router.post(
  '/profile/update',
  isAuthenticated,
  userController.user_update_post
);

router.get(
  '/posts/:id/update',
  checkMessageOwnership,
  messageController.message_update_get
);

router.post(
  '/posts/:id/update',
  checkMessageOwnership,
  messageController.message_update_post
);

router.get(
  '/posts/:id/delete',
  checkMessageOwnership,
  messageController.message_delete_get
);

router.post(
  '/posts/:id/delete',
  checkMessageOwnership,
  messageController.message_delete_post
);

module.exports = router;
