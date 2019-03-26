const { Router } = require('express');
const  UserRouter  = require('./users');
const StudentRouter = require('./student');
const AuthRouter = require('./auth');
const CourseRouter = require('./courses');

const router = new Router();

router.get('/status', (req, res) => res.status(200).json('ok'));

router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/courses', CourseRouter);
router.use('/student', StudentRouter)


module.exports = router;
