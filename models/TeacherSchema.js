const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./User');

const TeacherSchema = new Schema({
    responsible: {
        type: String,
        enum: ['SI', 'GB', 'ELEC', 'MAM', "GE"]
    },
    studentsValidate: {
        type: [
            {
                student: {
                    type: Schema.Types.ObjectId,
                    ref: 'user',
                    unique: true,
                    validate: {
                        validator: (studentId) => new Promise((resolve, reject) => {
                            UserSchema.findById(studentId, (err, student) => {
                                if (student === null)
                                    reject("Student does not exists");
                                else
                                    resolve();
                            })
                        })
                    }
                }
            }
        ],
        default: []
    }
});


module.exports = TeacherSchema;
