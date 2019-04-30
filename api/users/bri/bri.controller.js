const UserModel = require("../../../models/User");

const formatBri = (student) => {
    const usr = student.toObject();
    delete usr.__v;
    delete usr.password;
    return usr;
};

exports.getAll = (req, res) => {
    UserModel.find({role: "bri"}, (err, users) => {
        if (err || users == null)
            return res.status(404).send();
        users = users.map(bri => formatBri(bri));
        return res.status(200).json(users);}
    )
};

exports.addTimeSlot = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        const bri = user.toObject();
        bri.briInfo.appointment.push({timeSlot: req.body});
        console.log(bri.briInfo.appointment);
        user.set(bri);
        user.save()
            .then(bri => res.status(200).json(formatBri(bri)))
            .catch(err => res.status(404).json(err))
    })
};
