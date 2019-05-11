const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = require('./StudentSchema');
const TeacherSchema = require('./TeacherSchema');
const BriSchema = require('./BriSchema');

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
    type: String
  },
  lastConnection: Date,
  role: {
    type: String,
    enum: ["bri", "teacher", "student"],
    required: [true, 'role is required']
  },
  sendedMessage: {
    type: [
            {
              sendedTo:{
                type: Schema.Types.ObjectId,
                ref: 'user',
                required: [true, 'User is required'],
                validate: {
                  validator: (userId) => new Promise((resolve, reject) => {
                    User.findById(userId, (err, user) => {
                      if (user === null)
                        reject("User does not exists");
                      else
                        resolve();
                    })
                  })
                }
              },
              content: String
            }
    ],
    default: []
  },
  receivedMessage: {
    type: [
      {
        receivedFrom:{
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: [true, 'User is required'],
          validate: {
            validator: (userId) => new Promise((resolve, reject) => {
              User.findById(userId, (err, user) => {
                if (user === null)
                  reject("User does not exists");
                else
                  resolve();
              })
            })
          }
        },
        content: String
      }
    ]
  },
  studentInfo: {
    type: StudentSchema,
    default: function () {
      if (this.role === "student") {
        return {}
      }
    }
  },
  teacherInfo: {
    type: TeacherSchema,
    default: function () {
      if (this.role === "teacher") {
        return {}
      }
    }
  },
  briInfo: {
    type: BriSchema,
    default: function () {
      if (this.role === "bri") {
        return {}
      }
    }
  }
});


mongoose.model('user', UserSchema);

const User = mongoose.model('user');


User.findByIdWithPostAndCourses = (id) => new Promise((resolve, reject) =>
  User.findById(id).populate('studentInfo.wishes.university').exec((err, user) => {
    if (err)
      return reject({status: 400, msg: 'Bad request'});
    else if (user === null)
      return reject({status: 404, msg: 'User not found'});
    resolve(user);
  })
);

User.findByEmail = (mail) => {
  return new Promise((resolve, reject) => {
    User.find({email: mail}, (err, user) => err !== null ?
      reject({status: 404, err: err}) : resolve(user[0]))
  });
};

User.findStudentsByStatusAndMajor = (status, major) =>
  new Promise((resolve, reject) => {
    if(major === undefined){
      User.find({
        "studentInfo.stateValidation": status,
      }).populate('studentInfo.wishes.university').exec((err, users) => {
        if (err)
          return reject({status: 400, err: err});
        if (users === null)
          return reject({status: 404, err: ''});
        return resolve(users);
      })
    } else {
      User.find({
        "studentInfo.stateValidation": status,
        "studentInfo.major": major
      }).populate('studentInfo.wishes.university').exec((err, users) => {
        if (err)
          return reject({status: 400, err: err});
        if (users === null)
          return reject({status: 404, err: ''});
        return resolve(users);
      })
    }
  });

module.exports = User;
