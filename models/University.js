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
  concernedDepartement: {
      type: [String],
      required: [true, 'Concerned departement is required']
  },
  url_to_website: {
      type: String,
      required: [true, 'Url is required']
  }
});

mongoose.model('university', UniversitySchema);

const University = mongoose.model('university');

module.exports = University;
