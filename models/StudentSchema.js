const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const University = require('./University');
const TimeSlotSchema = require('./TimeSlot');


const NotesSchema = new Schema({
  year: {
    type: Number,
    required: [true, 'Date is required']
  },
  schoolLevel: {
    type: String,
    required: [true, 'SchoolLevel is required']
  },
  school: {
    type: String,
    required: [true, 'School is required']
  },
  note: {
    type: Number,
    required: [true, 'Note is required']
  }
});
const StudentSchema = new Schema({
  major: {
    type: String,
    enum: ['SI', 'GB', 'ELEC', "MAM", "GE"]
  },
  year: {
    type: String,
    enum: ['3', '4', '5']
  },
  lastYearMajor: {
    type: String,
  },
  numStu: {
    type: Number,
    required: [true, 'student number is required']
  },
  wishes: {
    type: [
      {
        university: {
          type: Schema.Types.ObjectId,
          ref: 'university',
          required: [true, 'University is required'],
          validate: {
            validator: (univId) => new Promise((resolve, reject) => {
              University.findById(univId, (err, univ) => {
                if (univ === null)
                  reject("University does not exists");
                else
                  resolve();
              })
            })
          }
        }
        ,
        courses: [{
          type: Schema.Types.ObjectId,
          ref: 'university.courses._id'
        }],
        position: Number,
        ECTS_count: Number,
        semester: Number
      }],
    default: [],
  },
  attachments: {
    type: [
      {
        name: {
          type: String,
          required: [true, 'Attachement name is required']
        },
        document: {
          type: String,
          required: [true, 'Document type is required']
        },
        data: {
          type: String,
          require: [true, 'data is needed']
        }
      }
    ],
    default: []
  },
  stateValidation: {
    type: String,
    enum: ['waitStudent', 'waitTeacher', 'waitBriVerif', 'waitValidate', 'validate'],
    default: 'waitStudent'
  },
  notes: {
    type: [NotesSchema],
    default: []
  },
  appointment: {
    timeSlot:{
      type: TimeSlotSchema
    },
    bri:{
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    status:{
      type: String,
      enum: ['none','waiting','inProcess','done'],
      default: 'none'
    }
  }
});

StudentSchema.pre('save', function (next) {
  if (this.wishes === undefined)
    return next();
  const student = this.toObject();

  const res = student.wishes.reduce((prev, curr) => {
    if (curr.university._id === undefined) {
      if (prev[curr.university] === undefined)
        prev[curr.university] = 1;
      else
        prev[curr.university] += 1;
    }
    else {
      if (prev[curr.university._id] === undefined)
        prev[curr.university._id] = 1;
      else
        prev[curr.university._id] += 1;
    }
    return prev;
  }, {});
  let cond = true;
  for (let key in res) {
    if (res[key] > 1) {
      cond = false;
      break;
    }
  }

  if (!cond) {
    throw new Error("university id already taken");
  }
  else
    next();
});

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
