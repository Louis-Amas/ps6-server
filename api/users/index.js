const {Router} = require('express');
const UserController = require('./user.controller');
const StudentRouter = require('./students');
const TeacherRouter = require('./teachers');


const router = new Router();

router.use('/student', StudentRouter);
router.use('/teacher', TeacherRouter);

router.get('/', [
  UserController.get
]);

router.get('/:id', [
  UserController.isAuth,
  UserController.isAuthUserOwner,
  UserController.getById
]);

router.post('/', [
  UserController.insert
]);

router.put('/:id', [
  UserController.isAuth,
  UserController.isAuthUserOwner,
  UserController.update
]);

router.delete('/:id', [
  UserController.isAuth,
  UserController.isAuthUserOwner,
  UserController.delete
]);



module.exports = router;
