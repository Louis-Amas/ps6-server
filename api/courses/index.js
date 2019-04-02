const {Router} = require('express');
const CourseController = require('./course.controller');
const router = new Router();

router.get('/:univId/:semester', [
  CourseController.getAllCourseFromUniversityIdAndSemester
]);

router.post('/:univId', [
  CourseController.insert
]);
module.exports = router;
