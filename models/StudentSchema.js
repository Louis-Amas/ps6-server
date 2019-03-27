const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
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
/*
mongoose.model('student', StudentSchema);

const Student = mongoose.model('student');

Student.findByUserId = (id) => {
    return new Promise((resolve, reject) => {
        Student.find({ userId: new ObjectId(id)})
            .then((users) => {
                resolve(users[0]);
            })
            .catch(err => {
                reject(err)
            });
    });
};*/

module.exports = StudentSchema;
