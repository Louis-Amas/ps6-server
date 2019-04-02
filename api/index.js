const {Router} = require('express');
const UserRouter = require('./users');
const UniveristyRouter = require('./university');
const isAuth = require('./users/user.controller').isAuth;
const returnConnectedUser = require('./users/user.controller').returnConnectedUser;
const router = new Router();

router.get('/status', (req, res) => res.status(200).json('ok'));

router.use('/users', UserRouter);

router.use('/university', UniveristyRouter);

router.get('/auth', [
  isAuth,
  returnConnectedUser
]);

module.exports = router;
