const {Router} = require('express');
const BriController = require('./bri.controller');

const router = new Router();

router.get('/', [
    BriController.getAll
]);

//create a new time slot
router.post('/:id/timeSlot', [
   BriController.addTimeSlot
]);

router.put('/:id/appointment/accept', [
    BriController.acceptWaitingStudent
]);
//reservation of an available slot
router.put('/:id/appointment/available/:idAv', [
    BriController.slotReservedByStudent
]);

router.get('/appointment', [
    BriController.getAllAppointment
]);

module.exports = router;
