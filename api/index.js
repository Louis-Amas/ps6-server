const { Router } = require('express');
const  UserRouter  = require('./users');
const AuthRouter = require('./auth');

const router = new Router();

router.get('/status', (req, res) => res.status(200).json('ok'));

router.use('/users', UserRouter);
router.use('/auth', AuthRouter);

module.exports = router;
