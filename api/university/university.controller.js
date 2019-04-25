const UniversityModel = require("../../models/University");
const ObjectId = require('mongoose').Types.ObjectId;

exports.get = (req, res) =>
  UniversityModel.find().then(university => res.status(200).json(university));

exports.getById = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .then(university => university !== null ? res.status(200).json(university) : res.status(404).send());

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
    university.rankings.push(req.body);
    university.save()
      .then((univ) => res.status(200).json(univ))
      .catch((err) => res.status(400).send(err));
  });

exports.updateStudentRanking = (req, res) =>
  UniversityModel.findById(req.params.univId, (err, university) => {
    if (err || university == null)
      return res.status(404).send(err);

    const univCopy = university.toObject();
    let rankings = univCopy.rankings;
    rankings = rankings.filter(elem => elem.studentId.toString() === req.params.studentId);
    rankings.splice(req.body.position, 0, req.body.studentId);

    univCopy.rankings = rankings;
    university.set(univCopy);
    university.save()
      .then((univ) => res.status(200).json(univ))
      .catch((err) => res.status(400).send(err));
  });
/*
const getRankingByIdFromUniv = (univ, rankingId) => {
  const rankings = univ.rankings;
  let ranking;
  rankings.forEach((curr) => {
    if (curr._id.toString() === rankingId.toString())
      ranking = curr.students;
  });
  return ranking;
};

const setRankingByIdFromUniv = (univ, rankingId, newRanking) => {
  for (let rank in univ.rankings)
    if (rank._id === rankingId)
      rank = newRanking;
  return univ;
};*/

/*exports.insertNewStudentInRanking = (req, res) =>
  UniversityModel.findById(req.params.univId, (err, university) => {
    if (err || university === null)
      return res.status(404).send(err);
    let univCopy = university.toObject();
    const ranking = getRankingByIdFromUniv(univCopy, req.params.rankingId);
    ranking.push(req.body);
    univCopy = setRankingByIdFromUniv(univCopy, req.params.rankingId, ranking);
    university.set(univCopy);
    university.save()
      .then((univ) => res.status(200).json(univ))
      .catch((err) => res.status(400).send(err));

  });


exports.updateStudentRanking = (req, res) => {
  UniversityModel.findById(req.params.univId, (err, university) => {
    if (err || university === null)
      return res.status(404).send(err);

    let univCopy = university.toObject();
    let ranking = getRankingByIdFromUniv(univCopy, req.params.rankingId);

    if (req.body.position > ranking.length - 1 || req.body.position < 0)
      return res.status(400).send();

    const targetObjectId = req.params.studentId.toString();
    console.log(ranking[0].studentId.toString());
    ranking = ranking.filter((elem) => elem.studentId.toString() !==  targetObjectId);

    ranking.splice(req.body.position, 0, req.body.studentId);

    univCopy = setRankingByIdFromUniv(univCopy, req.params.rankingId, ranking);

    university.set(univCopy);
    university.save()
      .then((univ) => res.status(200).json(univ))
      .catch((err) => res.status(400).send(err));
  })
};*/

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
