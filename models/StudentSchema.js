const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    major: {
      type: String,
      enum: ['SI', 'GB', 'ELEC']
    },
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

StudentSchema.createWish = (student, wishData) => {
    return new Promise((resolve, reject) => {
        student.wishes.push(wishData);
        student.save((err) => {
            if (err) reject(err);
            else {
                resolve(student);
            }
        });
    });
};

module.exports = StudentSchema;
