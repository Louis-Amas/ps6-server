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
        courses: [{type: Schema.Types.ObjectId, ref: 'course'}],
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
});

StudentSchema.pre('save', function(next) {
  if (this.wishes === undefined)
    return next();
  const student = this.toObject();

  const res = student.wishes.reduce((prev, curr) => {
    if (prev[curr.universityId] === undefined)
      prev[curr.universityId] = 1;
    else
      prev[curr.universityId] += 1;

    return prev;
  }, {});
  let cond = true;
  for (let key in res) {
    if (res[key] > 1) {
      cond = false;
      break;
    }
  }

  if (!cond)
    throw new Error("wi");
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
