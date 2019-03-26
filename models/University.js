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
  },
  courses: [{type: Schema.Types.ObjectId, ref: 'course'}]
});

mongoose.model('university', UniversitySchema);
