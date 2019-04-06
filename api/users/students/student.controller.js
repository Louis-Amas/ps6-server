const UserModel = require("../../../models/User");
const UniversityModel = require("../../../models/University");

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
        .forEach( w => {
            if(w.position >= pos)
                w.position -= 1;
        });
    student.studentInfo.wishes.splice(pos-1, 1);
    return student;
};

const updateWishPosition = (user, univId, newPosition) =>{
    const student = user.toObject();
    const curWish = student.studentInfo.wishes.find(w => w.university._id.equals(univId));
    const oldPos = curWish.position;
    //swap wish
    student.studentInfo.wishes[oldPos - 1] = student.studentInfo.wishes[newPosition -1];
    student.studentInfo.wishes[newPosition -1] = curWish;
    //update their position
    student.studentInfo.wishes[oldPos - 1].position = oldPos;
    student.studentInfo.wishes[newPosition - 1].position = newPosition;
    return student;
};

exports.get = (req, res) => {
    UserModel.find({role: "student"}, (err, users) => {
        if (users === null)
          return res.status(200).json([]);
        users = users.map(students => formatStudent(students));
        return res.status(200).json(users);
    })
};


exports.insertWish = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        const student = user.toObject();
        req.body.position = student.studentInfo.wishes.length + 1;
        student.studentInfo.wishes.push(req.body);
        user.set(student);
        user.save()
            .then((user) => res.status(201).json(formatStudent(user)))
            .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(err.status).json(err.msg));
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
        if(err || user == null)
            return res.status(404).send();
        return res.status(201).json(user.studentInfo.wishes);
    })
};

exports.updateWish = (req, res) => {
    UserModel.findByIdWithPostAndCourses(req.params.id)
        .then((user) => {
        if(req.body.position === undefined)
            return res.status(400).send({
                "errors": {
                    "msg": "A position is needed"
                }
            });
        user.set(updateWishPosition(user, req.params.univId, req.body.position));
        user.save()
            .then((user) => res.status(201).json(user.studentInfo.wishes))
            .catch(err => res.status(400).json(err));
    })
        .catch(err => res.status(400).json(err.msg))
};
