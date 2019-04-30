const {Router} = require('express');
const BriController = require('./bri.controller');

const router = new Router();

router.get('/', [
    BriController.getAll
]);

router.post('/:id/timeSlot', [
   BriController.addTimeSlot
]);

module.exports = router;
