const UserModel = require("../../../models/User");

const formatTeacher = (teacher) => {
    const usr = teacher.toObject();
    delete usr.__v;
    delete usr.password;
    return usr;
};

exports.get = (req, res) => {
    UserModel.find({role: "teacher"}, (err, users) => {
        if (users === null)
            return res.status(200).json([]);
        users = users.map(teachers => formatTeacher(teachers));
        return res.status(200).json(users);
    })
};
