const UserModel = require("../../../models/User");
const UniversityModel = require("../../../models/University");
const ObjectId = require('mongoose').Types.ObjectId;

exports.stateVerify = (req, res, next) => {
    UserModel.findById(req.params.id, (err, user) => {
        if(err || user === null){
            return res.status(404).send();
        }
        if(user.studentInfo.stateValidation === "waitStudent"){
            req.body.user = user;
            return next();
        }
        return res.status(403).send({
            "errors": {
                "msg": "student is not at the state : waitStudent"
            }
        });
    });
};


const formatStudent = (student) => {
  const usr = student.toObject();
  delete usr.__v;
  delete usr.password;
  return usr;
};

const removeAndUpdateWish = (user, univId) => {
  const student = user.toObject();
  const pos = student.studentInfo.wishes.find(w => w.university._id.equals(univId)).position;
  student.studentInfo.wishes
    .forEach(w => {
      if (w.position >= pos)
        w.position -= 1;
    });
  student.studentInfo.wishes.splice(pos - 1, 1);
  return student;
};


const updateWishPosition = (user, univId, newPosition) => {
  const student = user.toObject();
  const curWish = student.studentInfo.wishes.find(w => w.university._id.equals(univId));
  const oldPos = curWish.position;
  //swap wish
  student.studentInfo.wishes[oldPos - 1] = student.studentInfo.wishes[newPosition - 1];
  student.studentInfo.wishes[newPosition - 1] = curWish;
  //update their position
  student.studentInfo.wishes[oldPos - 1].position = oldPos;
  student.studentInfo.wishes[newPosition - 1].position = newPosition;
  return student;
};

exports.get = (req, res) => {
  UserModel.find({role: "student"}).populate('studentInfo.wishes.university')
      .exec(async(err, users) => {
      if (err || users == null)
          return res.status(404).send();
        users = users.map(students => formatStudent(students));
        return res.status(200).json(users);
      })
};


exports.getStudentByUnivWishes = (req, res) => {
  UserModel
    .find({
      "studentInfo.stateValidation": "waitValidate",
      "studentInfo.wishes.university": new ObjectId(req.params.univId)
    })
    .populate('studentInfo.wishes.university')
    .exec(
    (err, users) => {
      if (err || users === null)
        return res.status(404).send();

      return res.status(200).json(users);
    });
};

exports.insertWish = (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    const student = user.toObject();
    if (!req.body.position)
      req.body.position = student.studentInfo.wishes.length + 1;
    student.studentInfo.wishes.push(req.body);
    user.set(student);
    user.save()
      .then((user) => res.status(201).json(formatStudent(user)))
      .catch(err => res.status(400).json(err));
  })
};

exports.insertAttachement = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
    .then(user => {
      const student = user.toObject();
      req.body.attachments.forEach(attachment => student.studentInfo.attachments.push(attachment));
      user.set(student);
      user.save()
        .then(updatedUser => res.status(201).json(updatedUser))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(err.status).send(err.msg))
};

exports.removeAttachment = (req, res) => {
    UserModel.findByIdWithPostAndCourses(req.params.id)
        .then(user => {
            const student = user.toObject();
            student.studentInfo.attachments = student.studentInfo.attachments.filter(a => a.name !== req.params.filename);
            user.set(student);
            user.save()
                .then(updatedUser => res.status(201).json(updatedUser))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).send(err.msg))
};

exports.removeNotes = (req, res) => {
    UserModel.findByIdWithPostAndCourses(req.params.id)
        .then(user => {
            const student = user.toObject();
            student.studentInfo.notes = student.studentInfo.notes.filter(a => a._id.toString() !== req.params.noteId.toString());
            user.set(student);
            user.save()
                .then(updatedUser => res.status(201).json(updatedUser))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).send(err.msg))
};

exports.insertNote = (req, res) => {
    UserModel.findByIdWithPostAndCourses(req.params.id)
        .then(user => {
            const student = user.toObject();
            student.studentInfo.notes.push(req.body.note);
            user.set(student);
            user.save()
                .then(updatedUser => res.status(201).json(updatedUser))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(err.status).send(err.msg))
};


exports.removeWish = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
    .then(user => {
      user.set(removeAndUpdateWish(user, req.params.univId));
      user.save()
        .then((user) => res.status(201).json(user.studentInfo.wishes))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.msg))
};

exports.getWishes = (req, res) => {
  UserModel.findById(req.params.id).populate('studentInfo.wishes.university')
    .exec((err, user) => {
      if (err || user == null)
        return res.status(404).send();
      return res.status(201).json(user.studentInfo.wishes);
    })
};

exports.getStudentsByValidateStatus = (req, res) =>
  UserModel.findStudentsByStatusAndMajor(req.params.status, req.query.major)
    .then(students => res.status(200).json(students))
    .catch(err => res.status(err.status).json(err));



exports.updateWish = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
    .then((user) => {
      let student = user.toObject();
      if (req.body.position !== undefined)
          student = updateWishPosition(user, req.params.univId, req.body.position);
      if(req.body.courses !== undefined){
          student.studentInfo.wishes.map(w => {
              if(w.university._id.toString() === req.params.univId)
                w.courses = req.body.courses;
          });
      }
      user.set(student);
      user.save()
        .then((user) => res.status(201).json(user.studentInfo.wishes))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err.msg))
};

exports.updateStudent = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        const student = user.toObject();
        for (let key in req.body)
          student.studentInfo[key] = req.body[key];
        user.set(student);
        user.save()
            .then((user) =>  res.status(201).json(formatStudent(user)))
            .catch(err => res.status(400).json(err));
    });
};

exports.updateAppointmentStatus = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        const student = user.toObject();
        for ( let key in req.body)
            student.studentInfo.appointment.status = req.body[key];
        user.set(student);
        user.save()
            .then((user) => res.status(201).json(formatStudent(user)))
            .catch( err => res.status(400).json(err));
    });
};
