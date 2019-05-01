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

//reservation of an available slot
router.put('/:id/timeSlot/:numTimeSlot/slotAvailable/:numSlotAvailable', [
    BriController.slotReservedByStudent
]);

module.exports = router;
