const UniversityModel = require("../../models/University");
const UserModel = require('../../models/User');

const ObjectId = require('mongoose').Types.ObjectId;


exports.get = (req, res) =>
  UniversityModel.find().then(university => res.status(200).json(university));

exports.getById = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .populate({
      path: 'rankings.studentId',
      select: '_id email firstName lastName studentInfo.wishes studentInfo.notes'
    })
    .exec( (err, university) => {
      if (err)
        return res.status(404).send();
      UserModel.populate(university.rankings.map(student => student.studentId), {
        path: 'studentInfo.wishes.university'
      }, (err, result) => {
        const unviCopy = university.toObject();
        unviCopy.rankings = result;
        return university !== null ? res.status(200).json(university) : res.status(404).send()
      });
    });

exports.insert = (req, res) => {
  const univ = new UniversityModel(req.body);
  univ.save()
    .then(university => {
      return res.status(201).json(university);
    })
    .catch(err => {
      if (err.code === 11000)
        return res.status(400).send({
          "errors": {
            "msg": "Name already taken"
          }
        });
      return res.status(400).send(err);
    });
};

exports.getByMajor = (req, res) =>
  UniversityModel.findByMajor(req.params.concernedDepartment)
    .then(university => university !== null ? res.status(200).json(university) : res.status(404).send());

exports.getUnivByIdAndCourseSemester = (req, res) =>
  UniversityModel.findByIdAndCourseSemester(req.params.univId, parseInt(req.params.semester))
    .then(university => university !== null ? res.status(200).json(university) : res.status(404).send());

exports.getCoursesByUnivIdSemesterAndLastYear = (req, res) => {
  UniversityModel.findOne({
    _id: new ObjectId(req.params.univId),
  }, (err, univ) => {
    if (err || univ === null)
      return res.status(404).send();

    const courses = univ.toObject().courses;

    if (req.query.semester)
      req.query.semester = parseInt(req.query.semester);


    const good = courses.filter((elem) => {
      for (let key in req.query)
        if (elem[key] !== req.query[key])
          return false;
      return true;
    });
    return res.status(200).json(good);
  });

};


exports.addStudentToRanking = (req, res) =>
  UniversityModel.findById(req.params.univId, (err, university) => {
    if (err || university == null)
      return res.status(404).send(err);
    req.body.studentId = new ObjectId(req.body.studentId);

    const univCopy = university.toObject();
    let rankings = univCopy.rankings;

    const position = req.body.position;
    delete req.body.position;
    rankings.splice(position, 0, req.body);

    univCopy.rankings = rankings;
    university.set(univCopy);
    university.save()
      .then((univ) => res.status(201).json(univ))
      .catch((err) => res.status(200).json(err));

  });

exports.removeStudentFromRanking = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .exec((err, university) => {
      if (err || university === null)
        return res.status(404).send(err);

      const univCopy = university.toObject();
      univCopy.rankings = univCopy.rankings
        .filter(elem => elem.studentId.toString() !== req.params.studentId);
      university.set(univCopy);
      university.save()
        .then(university => res.status(202).json(university))
        .catch(err => res.status(400).send(err));
    });

exports.updateStudentRanking = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .exec((err, university) => {
    if (err || university == null)
      return res.status(404).send(err);

    const univCopy = university.toObject();
    let rankings = univCopy.rankings;
    rankings = rankings.filter(elem => elem.studentId._id.toString() !== req.params.studentId);
    let user = univCopy.rankings.filter(elem => elem.studentId._id.toString() === req.params.studentId)[0];
    rankings.splice(req.body.position, 0, user);

    univCopy.rankings = rankings;
    university.set(univCopy);
    university.save()
      .then((univ) => {
        res.status(200).json(univ);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });


exports.insertCourseByUnivId = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .then(univ => {
      if (univ === null)
        return res.status(404).send();
      univ.courses.push(req.body);
      univ.save()
        .then((updateUniv) => res.status(201).json(updateUniv))
        .catch(err => res.status(err.status).send(err.msg));
    });

exports.deleteCourseByUnivIdAndCourseId = (req, res) =>
  UniversityModel.findById(req.params.univId).then(univeristy => {
    if (univeristy === null)
      return res.status(404).send();
    univeristy.courses.pull(req.params.courseId);
    univeristy.save()
      .then(univeristyDelete => res.status(200).json(univeristyDelete))
      .catch(err => res.status(400).send(err))
  });
