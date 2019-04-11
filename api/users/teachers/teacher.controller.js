const UserModel = require("../../../models/User");

const formatUser = (user) => {
    const usr = user.toObject();
    delete usr.__v;
    delete usr.password;
    return usr;
};

const findAndPostStudentByStateAndMajor = (res, major, studentState) => {
    UserModel.find({role: "student",
            'studentInfo.stateValidation': studentState,
            'studentInfo.major': major},
        (err, users) => {
            if(err)
                return res.status(400).json(err);
            if (users === null)
                return res.status(200).json([]);
            users = users.map(students => formatUser(students));
            return res.status(200).json(users);
        });
};

exports.get = (req, res) => {
    UserModel.find({role: "teacher"}, (err, users) => {
        if(err)
            return res.status(400).json(err);
        if (users === null)
            return res.status(200).json([]);
        users = users.map(teachers => formatUser(teachers));
        return res.status(200).json(users);
    })
};

exports.getConcernedStudent = (req, res) => {
    UserModel.findById(req.params.id, (err, teacher) => {
        if(err || teacher === null)
            return res.status(400).json(err);
        if(req.query.findBy === undefined) {
            //waitTeacher by default
            findAndPostStudentByStateAndMajor(res, teacher.teacherInfo.responsible, "waitTeacher");
        }
        else {
            findAndPostStudentByStateAndMajor(res, teacher.teacherInfo.responsible, req.query.findBy);
        }
    });
};
