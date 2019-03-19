const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UniversitySchema = new Schema({
  name: String,
  country: String,
  concerned_departement: [String],
  url_to_website: [String],
  courses: [
      {
          name: String,
          description: String,
          ECTS_count: Number,
          date_added: Date,
          major: String,
          semester: String,
          link_to_website: String
      }
  ]
});

mongoose.model('university', UniversitySchema);