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

router.put('/:id/appointment/:timeSlot/accept', [
    BriController.changeStatusOfStudent
]);
//reservation of an available slot
router.put('/:id/appointment/available/:idAv', [
    BriController.slotReservedByStudent
]);

router.get('/appointment', [
    BriController.getAllAppointment
]);

router.get('/:id/appointment/delay', [
    BriController.getDelay
]);

router.get('/:id/appointment/:timeSlot', [
        BriController.getAppointmentByDay
]);


module.exports = router;
