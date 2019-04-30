const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimeSlotSchema = require('./TimeSlot');

const BriSchema = new Schema({
    appointment: {
        type: [
            {
                timeSlot:{
                    type: TimeSlotSchema,
                    required: [true, "Time slot is required"]
                },
                reserved: {
                    type: [{
                        studentId: {
                            type: Schema.Types.ObjectId,
                            required: [true, "Student is required"]
                        },
                        studentTimeSlot: {
                            type: TimeSlotSchema,
                            required: [true, "Student time slot is required"]
                        }
                    }],
                    default: []
                }
            }
        ],
        default: []
    },
});

module.exports = BriSchema;
