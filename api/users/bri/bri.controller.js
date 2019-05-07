const UserModel = require("../../../models/User");

const formatBri = (bri) => {
    const usr = bri.toObject();
    delete usr.__v;
    delete usr.password;
    usr.briInfo.appointment.map(a => delete a._id);
    return usr;
};

const createTimeSlot = (departureTime, endTime, interval) => {
    const dep = new Date(departureTime);
    const end = new Date(endTime);
    let date = new Date(departureTime);
    let res = [];

    for(let i = 0; i < end - dep; i += interval * 60000){
        const tmp = new Date(date);
        tmp.setMinutes(date.getMinutes() + interval);
        res.push({ slot:{
                departureTime: date,
                endTime: tmp
            }
        });
        date = tmp;
    }
    return res;
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
        if(err || user === null)
            return res.status(404).send();
        const bri = user.toObject();
        const slots = createTimeSlot(req.body.departureTime, req.body.endTime, 15);
        bri.briInfo.appointment.push({timeSlot: req.body, available: slots});
        user.set(bri);
        user.save()
            .then(bri => res.status(200).json(formatBri(bri)))
            .catch(err => res.status(404).json(err))
    })
};

exports.slotReservedByStudent = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        if(err || user === null)
            return res.status(404).send();
        const bri = user.toObject();
        bri.briInfo.appointment[req.params.numTimeSlot].available[req.params.numSlotAvailable].reservedBy = req.body.reservedBy;
        user.set(bri)
        user.save()
            .then(bri => res.status(200).json(formatBri(bri)))
            .catch(err => res.status(404).json(err))
    });
};
