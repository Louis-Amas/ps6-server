const {Router} = require('express');
const UniversityController = require('./university.controller');
const router = new Router();

router.get('/', [
  UniversityController.get
]);

router.get('/:univId', [
  UniversityController.getById
]);

router.post('/', [
  UniversityController.insert
]);

router.delete('/:univId/rankings/student/:studentId', [
  UniversityController.removeStudentFromRanking
]);
router.get('/concernedDepartment/:concernedDepartment', [
  UniversityController.getByMajor
]);

router.post('/:univId/rankings/', [
    UniversityController.addStudentToRanking
]);

router.put('/:univId/student/:studentId', [
  UniversityController.updateStudentRanking
]);

router.get('/:univId/courses', [
  UniversityController.getCoursesByUnivIdSemesterAndLastYear
]);

router.get('/:univId/courses/semester/:semester', [
  UniversityController.getUnivByIdAndCourseSemester
]);

router.delete('/:univId/courses/:courseId', [
  UniversityController.deleteCourseByUnivIdAndCourseId
]);

router.post('/:univId/courses', [
  UniversityController.insertCourseByUnivId
]);

module.exports = router;
