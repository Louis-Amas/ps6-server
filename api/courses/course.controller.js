const CourseModel = require('../../models/Course');

exports.getAllCourseFromUniversityIdAndMajor = (req, res) => {
  console.log(req.params);
  if (!req.params.univId || ! req.params.major)
    return res.status(400).json("Bad request");
  CourseModel.getByUnivIdAndMajor(req.params.univId, req.params.major)
    .then((courses) => {
      return res.status(200).json(courses);
    }).catch(err => {
      return res.status(400).json(err);
  });
};
