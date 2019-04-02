const {Router} = require('express');
const CourseController = require('./course.controller');
const router = new Router();

router.get('/:univId/:major', [
  CourseController.getAllCourseFromUniversityIdAndMajor
]);

router.post('/:univId', [
  CourseController.insert
]);
module.exports = router;
