const UserModel = require("../../../models/User");

const formatBri = (bri) => {
    const usr = bri.toObject();
    delete usr.__v;
    delete usr.password;
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
    UserModel.findById(req.params.id).populate({path: 'briInfo.appointment.available.reservedBy',
        select: 'firstName lastName studentInfo.major studentInfo.appointment.status'})
        .exec((err, user) => {
            if(err || user === null)
                return res.status(404).send();
            const bri = user.toObject();

            //find position to insert new time slot
            let index = bri.briInfo.appointment.findIndex(a => {
                const date1 = new Date(a.timeSlot.departureTime);
                const date2 = new Date(req.body.departureTime);
                return (date1 > date2);
            });
            if(index === -1)
                index = bri.briInfo.appointment.length;

            //insert time slot
            const slots = createTimeSlot(req.body.departureTime, req.body.endTime, 15);
            bri.briInfo.appointment.splice(index, 0, {timeSlot: req.body, available: slots});

            //save change
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
        UserModel.findById(req.body.reservedBy, (err, stu) => {
            if(err || stu === null)
                return res.status(404).send();
            const student = stu.toObject();

            bri.briInfo.appointment.forEach(app => {
                app.available.forEach(av => {
                    if(av._id.toString() === req.params.idAv.toString()){
                        av.reservedBy = req.body.reservedBy;
                        student.studentInfo.appointment = {timeSlot: av.slot, bri: bri._id, status: "none"}
                    }
                })
            });
            user.set(bri);
            user.save()
                .then(() => {
                    stu.set(student);
                    stu.save()
                        .then(s => res.status(200).json(formatBri(s)))
                        .catch(err => res.status(404).json(err))
                })
                .catch(err => res.status(404).json(err))

        });
    });
};

exports.getAllAppointment = (req, res) => {
    UserModel.find({role: 'bri'}, ['briInfo.appointment', 'firstName', 'lastName'])
        .populate({path: 'briInfo.appointment.available.reservedBy',
            select: 'firstName lastName studentInfo.major studentInfo.appointment.status'})
        .exec((err, users) => {
            if(err || users === null)
                return res.status(404).send();
            return res.status(200).json(users);
        });
};
