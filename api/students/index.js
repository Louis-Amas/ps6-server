const {Router} = require('express');
const StudentController = require('./student.controller');

const router = new Router();

router.get('/', [
    StudentController.get
]);

router.post('/:id/wishes', [
    StudentController.insertWish
]);


module.exports = router;
