const {Router} = require('express');
const UserController = require('./user.controller');

const router = new Router();

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

router.post('/:id/wishes', [
  UserController.insertWish
]);


module.exports = router;
