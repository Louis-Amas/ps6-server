const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = require('./CourseSchema');

const UniversitySchema = new Schema({
  name: {
      type: String,
      unique: true,
      required: [true, 'Name is required']
  },
  country: {
      type: String,
      required: [true, 'Country is required']
  },
  concernedDepartment: {
      type: [String],
      required: [true, 'Concerned departement is required']
  },
  url_to_website: {
      type: String,
      required: [true, 'Url is required']
  },
  courses: {
    type: [CourseSchema],
    default: []
  }
});

mongoose.model('university', UniversitySchema);

const University = mongoose.model('university');


University.findByCountry = (country, concernedDepartment) => {
    return new Promise((resolve, reject) => {
        University.find({country: country, concernedDepartment: concernedDepartment})
            .then(university => resolve(university))
            .catch(err => reject(err));
    });
};

University.findByIdAndCourseSemester = (univId, semester) => new Promise(((resolve, reject) =>
    University.findById(univId)
      .then(univ => {
        if (univ === null)
          reject({status: 404, message: 'Univeristy not found'});
        const courses = univ.courses.filter(course => course.semester !== semester);
        const copyUniv = univ._doc;
        copyUniv.courses = courses;
        resolve(copyUniv);
      })
      .catch(err => reject(err))
  ));

module.exports = University;
