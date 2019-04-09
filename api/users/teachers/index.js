const {Router} = require('express');
const TeacherController = require('./student.controller');

const router = new Router();

router.get('/', [
    TeacherController.get
]);

module.exports = router;
