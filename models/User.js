const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = require('./StudentSchema');
UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'first name is required']
  },
  lastName: {
    type: String,
    required: [true, 'last name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
    validate: {
      validator: (email) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return email.match(emailRegex);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  birthDate: {
    type: Date,
    required: [true, 'birth date is required']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  createAt: {
    type: Date,
    default: new Date()
  },
  phoneNumber: {
    type: Number
  },
  lastConnection: Date,
  role: {
    type: String,
    enum: ["bri", "teacher", "student"],
    required: [true, 'role is required']
  },
  studentInfo:{
    type: StudentSchema,
    default: StudentSchema
  }
});

UserSchema.index({ email: 1}, { unique: true});

mongoose.model('user', UserSchema);

const User = mongoose.model('user');


User.findByEmail = (mail) => {
  return new Promise((resolve, reject) => {
    User.find({email: mail}, (err, user) => err !== null ? reject({status: 404, err: err}) : resolve(user[0]))
  });
};


module.exports = User;
