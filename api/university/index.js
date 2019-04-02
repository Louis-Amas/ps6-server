const {Router} = require('express');
const UniversityController = require('./university.controller');
const router = new Router();

router.get('/', [
    UniversityController.get
]);

router.post('/', [
    UniversityController.insert
]);

router.get('/:country/:concernedDepartment', [
    UniversityController.getByCountryAndMajor
]);

module.exports = router;
