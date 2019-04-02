const UserModel = require("../../models/User");
const StudentModel = require("../../models/StudentSchema");

const formatStudent = (student) => {
    const usr = student._doc;
    delete usr.__v;
    delete usr.password;
    return usr;
};

const removeAndUpdateWish = (user, univId) => {
    const student = user._doc;
    const pos = student.studentInfo.wishes.find(w => w.universityId.equals(univId)).position;
    student.studentInfo.wishes
        .forEach( w => {
            if(w.position >= pos)
                w.position -= 1;
        });
    student.studentInfo.wishes.splice(pos-1, 1);
    return student;
};

exports.get = (req, res) => {
    UserModel.find().then(users => {
        users = users.filter(user => user.role === "student");
        users = users.map(students => formatStudent(students));
        return res.status(200).json(users);
    })
};


exports.insertWish = (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {
            const student = user._doc;
            req.body.position = student.studentInfo.wishes.length + 1;
            student.studentInfo.wishes.push(req.body);
            user.set(student);
            user.save()
                .then((user) => res.status(201).json(formatStudent(user)))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => {
            res.status(404).json(err);
        });
};

exports.removeWish = (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {
            user.set(removeAndUpdateWish(user, req.params.univId));
            user.save()
                .then((user) => res.status(201).json(formatStudent(user)))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => {
            res.status(404).json(err);
        });
};