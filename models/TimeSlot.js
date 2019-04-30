const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSlotSchema = new Schema({
    day: {
        type: Date,
        required: [true, 'day is required'],
    },
    departureTime: {
        type: Date,
        required: [true, 'departure Time is required'],
    },
    endTime: {
        type: Date,
        required: [true, 'end Time is required'],
    }
});

module.exports = TimeSlotSchema;
