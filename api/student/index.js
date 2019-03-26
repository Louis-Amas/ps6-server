const { Router } = require('express');
const  StudentController  = require('./student.controller');

const router = new Router();


router.get('/', [
    StudentController.get
]);

router.get('/:id', [
    StudentController.getById
]);

module.exports = router;
