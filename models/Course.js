const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const University = require('./University');

const CourseSchema = new Schema({
  univId: {
    type: Schema.Types.ObjectId,
    ref: 'university',
  },
  name: {
    type: String,
    required: [true, 'Courses name is required']
  },
  description: {
    type: String,
    required: [true, 'courses Description name is required']
  },
  ECTS_count: {
    type: Number,
    required: [true, 'Courses ECTS count is required']
  },
  date_added: {
    type: Date,
    default: new Date()
  },
  major: {
    type: String,
    required: [true, 'Courses major is required']
  },
  semester: {
    type: Number,
    required: [true, 'Courses semester is required']
  },
  link_to_courses: {
    type: String
  }
});

mongoose.model('course', CourseSchema);

const Course = mongoose.model('course');

Course.getByUnivIdAndSemester = (univeristyId, semester) => {
  return new Promise((resolve, reject) => {
    Course.find({
      univId: mongoose.Types.ObjectId(univeristyId),
      semester: semester
    }).then((courses) => resolve(courses))
      .catch(err => reject(err));
  });
};




module.exports = Course;
