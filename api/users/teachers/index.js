const {Router} = require('express');
const TeacherController = require('./teacher.controller');

const router = new Router();

router.get('/', [
    TeacherController.get
]);

router.get('/:id/students', [
    //?findBy=state if you want to find student with a special state
    //waitTeacher by default
    TeacherController.getConcernedStudent
]);


module.exports = router;
