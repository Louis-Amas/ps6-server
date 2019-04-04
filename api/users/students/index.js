const {Router} = require('express');
const StudentController = require('./student.controller');

const router = new Router();

router.get('/', [
    StudentController.get
]);

router.get('/:id/wishes', [
    StudentController.getWishes
]);

router.post('/:id/wishes', [
    StudentController.insertWish
]);

router.delete('/:id/wishes/:univId', [
    StudentController.removeWish
]);
module.exports = router;