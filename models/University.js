const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UniversitySchema = new Schema({
  name: {
      type: String,
      required: [true, 'Name is required']
  },
  country: {
      type: String,
      required: [true, 'Country is required']
  },
  concerned_departement: {
      type: [String],
      required: [true, 'Concerned departement is required']
  },
  url_to_website: {
      type: String,
      required: [true, 'Url is required']
  },
  courses: [
      {
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
      }
  ]
});

mongoose.model('university', UniversitySchema);
