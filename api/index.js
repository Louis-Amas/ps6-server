const {Router} = require('express');
const UserRouter = require('./users');
const CourseRouter = require('./courses');
const isAuth = require('./users/user.controller').isAuth;
const returnConnectedUser = require('./users/user.controller').returnConnectedUser;
const router = new Router();

router.get('/status', (req, res) => res.status(200).json('ok'));

router.use('/users', UserRouter);
router.use('/courses', CourseRouter);

router.get('/auth', [
  isAuth,
  returnConnectedUser
]);

module.exports = router;
