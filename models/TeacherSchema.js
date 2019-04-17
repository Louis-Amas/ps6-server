const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  responsible: {
    type: String,
    enum: ['SI', 'GB', 'ELEC', 'MAM', "GE"]
  }
});


module.exports = TeacherSchema;
