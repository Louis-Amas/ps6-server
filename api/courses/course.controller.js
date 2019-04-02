const CourseModel = require('../../models/Course');

const formatCourses = (courses) => {
  return courses.reduce((prev, curr) => {
    const cop = curr._doc;
    delete cop.__v;
    prev.push(cop);
    return prev;
  }, []);
};

const formatCourse = (course) => {
  const c = course._doc;
  delete c._doc;
  delete c.__v;
  return c;
};


exports.getAllCourseFromUniversityIdAndMajor = (req, res) => {
  if (!req.params.univId || !req.params.major)
    return res.status(400).json("Bad request");
  CourseModel.getByUnivIdAndMajor(req.params.univId, req.params.major)
    .then((courses) => {
      return res.status(200).json(formatCourses(courses));
    }).catch(err => {
    return res.status(404).send();
  });
};

exports.insert = (req, res) => {
  req.body.univId = req.params.univId;
  CourseModel.createCourse(req.body)
      .then(course => {
        console.log("la");
        res.status(201).json(formatCourse(course));
      })
      .catch(err => {
        return res.status(400).send(err);
      });
};
