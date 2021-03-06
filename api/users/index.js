const {Router} = require('express');
const UserController = require('./user.controller');
const StudentRouter = require('./students');
const TeacherRouter = require('./teachers');
const BriRouter = require('./bri');


const router = new Router();

router.use('/student', StudentRouter);
router.use('/teacher', TeacherRouter);
router.use('/bri', BriRouter);

router.get('/', [
  UserController.get
]);

router.get('/:id', [
  UserController.isAuth,
  UserController.verifyPermissionsUser(['bri', 'teacher']),
  UserController.getById
]);


router.post('/', [
  UserController.insert
]);


router.put('/:id', [
  UserController.isAuth,
  UserController.verifyPermissionsUser([ 'teacher']),
  UserController.update
]);

router.delete('/:id', [
  UserController.isAuth,
  UserController.isAuthUserOwner,
  UserController.delete
]);

router.post('/:id/message', [
  UserController.sendMessage
]);

module.exports = router;
