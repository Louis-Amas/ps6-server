const {Router} = require('express');
const StudentController = require('./student.controller');

const router = new Router();

router.get('/', [
    StudentController.get
]);

router.get('/:id/wishes/', [
    StudentController.getWishes
]);

router.post('/:id/attachements', [
    StudentController.stateVerify,
    StudentController.insertAttachement
]);

router.post('/:id/wishes', [
    StudentController.stateVerify,
    StudentController.insertWish
]);

router.delete('/:id/wishes/:univId', [
    StudentController.stateVerify,
    StudentController.removeWish
]);

router.put('/:id/wishes/:univId', [
    StudentController.stateVerify,
    StudentController.updateWish
]);

router.put('/:id', [
    StudentController.updateStudent
]);

module.exports = router;
