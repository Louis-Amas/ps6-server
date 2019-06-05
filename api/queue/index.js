const {Router} = require('express');

const router = new Router();
const QueueController = require('./queue.controller');

router.get('/studentForm', [
    QueueController.getStudentForm
]);


module.exports = router;
