const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const University = require('./University');

const StudentSchema = new Schema({
  major: {
    type: String,
    enum: ['SI', 'GB', 'ELEC']
  },
  wishes: {
    type: [
      {
        university: {
          type: Schema.Types.ObjectId,
          ref: 'university',
          unique: true,
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

StudentSchema.pre('save', function (next) {
  if (this.wishes === undefined)
    return next();
  const student = this.toObject();

  const res = student.wishes.reduce((prev, curr) => {
    if (prev[curr.univeristy] === undefined)
      prev[curr.univeristy] = 1;
    else
      prev[curr.univeristy] += 1;

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
