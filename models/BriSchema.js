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
                available: {
                    type: [{
                        reservedBy: {
                            type: Schema.Types.ObjectId,
                        },
                        slot: {
                            type: TimeSlotSchema,
                            required: [true, "time slot is required"]
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
