const CourseModel = require('../../models/Course');

const formatCourses = (courses) => {
  console.log(courses);
  return courses.reduce((prev, curr) => {
    const cop = curr._doc;
    delete cop.__v;
    prev.push(cop);
    return prev;
  }, []);
};

exports.getAllCourseFromUniversityIdAndMajor = (req, res) => {
  if (!req.params.univId || ! req.params.major)
    return res.status(400).json("Bad request");
  CourseModel.getByUnivIdAndMajor(req.params.univId, req.params.major)
    .then((courses) => {
      return res.status(200).json(formatCourses(courses));
    }).catch(err => {
      return res.status(404).send();
  });
};

