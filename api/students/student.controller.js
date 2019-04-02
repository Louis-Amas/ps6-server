const UserModel = require("../../models/User");
const StudentModel = require("../../models/StudentSchema");

const formatStudent = (student) => {
    const usr = student._doc;
    delete usr.__v;
    delete usr.password;
    return usr;
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
            console.log(user);
            const student = user._doc;
            student.studentInfo.wishes = [req.body];
            user.set(student);
            user.save()
                .then((user) => res.status(201).json(formatStudent(user)))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => {
            res.status(404).json(err);
        });
};
