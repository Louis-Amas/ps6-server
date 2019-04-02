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

router.get('/country/:country/:concernedDepartment', [
    UniversityController.getByCountryAndMajor
]);

router.get('/:univId/courses/semester/:semester', [
  UniversityController.getUnivByIdAndCourseSemester
]);

router.post('/:univId/courses', [
  UniversityController.insertCourseByUnivId
]);

module.exports = router;
