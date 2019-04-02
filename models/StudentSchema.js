const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    major: {
      type: String,
      enum: ['SI', 'GB', 'ELEC']
    },
    wishes: {
        type: [
                {
                    universityId: {
                        type: Schema.Types.ObjectId,
                        ref: 'university',
                        unique: true,
                        required: [true, 'UniversityId is required']
                    },
                    courses: [{ type: Schema.Types.ObjectId, ref: 'course' }],
                    position: Number,
                }],
        default: [],
    },
    suppDocs: {
        type: [
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
                ],
        default: []
    }
}, { _id: false});


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
