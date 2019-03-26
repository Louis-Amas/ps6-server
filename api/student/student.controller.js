const UserModel = require("../../models/User");
const StudentModel = require("../../models/Student");

attachUser = (student) => {
    console.log(student);
    return new Promise((resolve, reject) => {
        UserModel.findById(student.userId)
            .then( (res) => {
                console.log(res);
                const currentUser = res;
                const currentStudent = Object.assign({},student);
                currentStudent.firstName = currentUser.firstName;
                currentStudent.lastName = currentUser.lastName;
                currentStudent.email = currentUser.email;
                currentStudent.birthDate = currentStudent.email;
                console.log(currentStudent);
                return resolve(currentStudent);
            });
    });
};

exports.get = (req, res) => {
    StudentModel.find().then(result => {
        result.map(s => {
            attachUser(s).then(student => {
                res.status(200).json(student);
            })
        })
    });
};


exports.getById = (req, res) => {
    StudentModel.findById(req.params.id)
        .then(user => {
            attachUser(user).then( student => {
                res.status(200).json(student);
            })
        })
        .catch(err => {
            res.status(404).json(err);
        });
};
