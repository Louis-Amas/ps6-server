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


exports.getAllCourseFromUniversityIdAndSemester = (req, res) => {
  if (!req.params.univId || !req.params.semester)
    return res.status(400).json("Bad request");
  CourseModel.getByUnivIdAndSemester(req.params.univId, req.params.semester)
    .then((courses) => {
      return res.status(200).json(formatCourses(courses));
    }).catch(err => {
    return res.status(404).send();
  });
};

exports.insert = (req, res) => {
  const course  = new CourseModel(req.body);
  course.save()
      .then(course => {
        res.status(201).json(formatCourse(course));
      })
      .catch(err => {
        return res.status(400).send(err);
      });
};
