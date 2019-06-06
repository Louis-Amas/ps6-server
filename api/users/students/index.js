const {Router} = require('express');
const StudentController = require('./student.controller');
const UserController = require('../user.controller');

const router = new Router();

router.get('/', [
  StudentController.get
]);

router.get('/:id/wishes/', [
  StudentController.getWishes
]);

router.get('/status/:status', [
  UserController.isAuth,
  UserController.verifyPermissionsUser(['bri', 'teacher']),
  StudentController.getStudentsByValidateStatus
]);


router.get('/query', [
    StudentController.getStudentByQuery
]);

router.get('/wishes/university/:univId', [
  StudentController.getStudentByUnivWishes
]);

router.post('/:id/attachments', [
  StudentController.stateVerify,
  StudentController.insertAttachement
]);

router.delete('/:id/attachments/:filename', [
  StudentController.stateVerify,
  StudentController.removeAttachment
]);

router.post('/:id/notes', [
  StudentController.stateVerify,
  StudentController.insertNote
]);

router.delete('/:id/notes/:noteId', [
  StudentController.stateVerify,
  StudentController.removeNotes
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

router.put('/:id/appointment/status', [
    StudentController.updateAppointmentStatus
]);

router.put('/appointment/status', [
    UserController.isAuth,
    StudentController.updateConnectedStudentToWaiting
]);


module.exports = router;
