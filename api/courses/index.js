const {Router} = require('express');
const CourseController = require('./course.controller');
const router = new Router();

router.get('/:univId/:major', [
  CourseController.getAllCourseFromUniversityIdAndMajor
]);
module.exports = router;
