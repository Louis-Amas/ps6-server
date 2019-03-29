const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  }
});

mongoose.model('university', UniversitySchema);

const University = mongoose.model('university');

University.createUniversity = (universityData) => {
    return new Promise((resolve, reject) => {
        const university = new University(universityData);
        console.log(university);
        university.save((err) => {
            if (err) reject(err);
            else resolve(university);
        });
    });
};

University.findByCountry = (country, concernedDepartment) => {
    return new Promise((resolve, reject) => {
        University.find({country: country, concernedDepartment: concernedDepartment})
            .then(university => resolve(university))
            .catch(err => reject(err));
    });
};

module.exports = University;
