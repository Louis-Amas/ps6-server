const mongoose = require("mongoose");
const UniversitySchema = require("../models/University");
const UserSchema = require("../models/User");
const Course = require('../models/CourseSchema');

mongoose.connect("mongodb://localhost/ps6", {useNewUrlParser: true, useCreateIndex: true});
mongoose.set("debug", true);

const University = mongoose.model("university");
const User = mongoose.model("user");

uni1 = new University({
  name: `Polytech'Nice Sophia`,
  country: "France",
  concerned_departement: ["SI", "GB"],
  url_to_website: "http://polytech.fr"
});

uni1.save();


const course = new Course({
  univId: new mongoose.Types.ObjectId("5c90b8857e7be91ada3f422e"),
  name: 'sweeden',
  description: 'blblbl',
  ECTS_count: 4,
  date_added: new Date(),
  major: 'gb',
  semester: 5,
  link_to_courses: 'http://bo.fr'
});

course.save();
/*
u1 = new User({
    firstName: 'Louis',
    lastName: 'Amas',
    birthDate: new Date("1998:03:19"),
    email: 'amaslouis@gmail.com',
    password: '123',
    role: 'student'
});
*/


// u1.save(err => {
//     if (err) {
//         console.log('not working', err)
//     }
// })
//uni1.save();
