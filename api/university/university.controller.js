const UniversityModel = require("../../models/University");

exports.get = (req, res) =>
    UniversityModel.find().then(university => res.status(200).json(university));

exports.getById = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .then(university => university !== null ? res.status(200).json(university) : res.status(404).send())
    .catch(err => res.status(400).send(err));

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

exports.getByCountryAndMajor = (req, res) =>
    UniversityModel.findByCountry(req.params.country, req.params.concernedDepartment)
        .then(university =>  university !== null ? res.status(200).json(university) : res.status(404).send())
        .catch(err => res.status(400).json(err));

exports.getUnivByIdAndCourseSemester = (req, res) =>
  UniversityModel.findByIdAndCourseSemester(req.params.univId, req.params.semester)
    .then(university =>  university !== null ? res.status(200).json(university) : res.status(404).send())
    .catch(err => res.status(404).json(err));

exports.insertCourseByUnivId = (req, res) =>
  UniversityModel.findById(req.params.univId)
    .then(univ => {
      if (univ === null)
        return res.status(404).send();
      univ.courses.push(req.body);
      univ.save()
        .then((updateUniv) => res.status(201).json(updateUniv))
        .catch(err => res.status(err.status).send(err.msg));
    })
    .catch(err => {
      res.status(400).send(err);
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
