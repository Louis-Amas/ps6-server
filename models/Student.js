const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    wishes: [
        {
            univeristyId: {
                type: Schema.Types.ObjectId,
                ref: 'university',
                required: [true, 'UniversityId is required']
            },
            courses: [{ type: Schema.Types.ObjectId, ref: 'course' }],
            position: Number
        }
    ],
    suppDocs: [
        {
            name: {
                type: String,
                required: [true, 'suppDoc name is required']
            },
            data: {
                type: Buffer,
                require: [true, 'data is needed']
            }
        }
    ]
});

mongoose.model('student', StudentSchema);

const Student = mongoose.model('student');

module.exports = Student;
