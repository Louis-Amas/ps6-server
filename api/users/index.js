const { Router } = require('express');
const  UserController  = require('./user.controller');

const router = new Router();

router.get('/:id', [
    UserController.getById
]);

router.post('/', [
    UserController.insert
]);

router.put('/:id', [
    UserController.isPasswordAndUserMatch,
    UserController.update
])

module.exports = router;
