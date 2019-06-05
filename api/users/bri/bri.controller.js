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

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

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

exports.changeStatusOfStudent = (req, res) => {
    UserModel.findById(req.params.id).populate({path: 'briInfo.appointment.available.reservedBy',
        select: 'firstName lastName studentInfo.major studentInfo.appointment.status'})
        .exec((err, bri) => {
            if(err || bri === null)
                return res.status(404).send();
            let findOne = false;
            for (let app of bri.briInfo.appointment) {
                const currDate = new Date(req.params.timeSlot);
                const appDate = new Date(app.timeSlot.departureTime);
                if(currDate.getDate() === appDate.getDate()
                    && currDate.getMonth() === appDate.getMonth()
                    && currDate.getFullYear() === appDate.getFullYear()){
                    for (let avai of app.available) {
                        if(avai.reservedBy !== undefined){
                            if (avai.reservedBy.studentInfo.appointment.status === req.body.lastStatus) {
                                avai.reservedBy.studentInfo.appointment.status = req.body.newStatus;
                                findOne = true;
                                avai.reservedBy.save()
                                    .then(() => {
                                        return res.status(200).send({
                                            "lastStatus": req.body.lastStatus,
                                            "newStatus": req.body.newStatus,
                                            "result": findOne
                                        });
                                    })
                                    .catch(err => res.status(400).send(err));
                                return;
                            }
                        }
                    }
                    if(!findOne) return res.status(200).send({
                        "lastStatus": req.body.lastStatus,
                        "newSatus": req.body.newStatus,
                        "result": findOne
                    });
                }
            }
        });
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

exports.getAppointmentByDay = (req, res) => {
    UserModel.findById(req.params.id).populate({path: 'briInfo.appointment.available.reservedBy',
        select: 'firstName lastName studentInfo.major studentInfo.appointment.status'})
        .exec((err, user) => {
            if(err || user === null)
                return res.status(404).send();
            else {
                const date = new Date(req.params.timeSlot);
                const bri = user.toObject();
                //return date.prototype.getDay();
                const bo = bri.briInfo.appointment.filter( app => {
                    const dateApp = new Date(app.timeSlot.departureTime);
                    return dateApp.getDate() === date.getDate() && dateApp.getMonth() === date.getMonth() && dateApp.getFullYear() === date.getFullYear();
                });
                return res.status(200).json(bo);
                }

        })
};

exports.getDelay = (req,res) => {
    UserModel.findById(req.params.id).populate({path: 'briInfo.appointment.available.reservedBy',
        select: 'firstName lastName studentInfo.major studentInfo.appointment.status studentInfo.appointment.timeSlot.departureTime'})
        .exec((err, user) => {
            if(err || user === null)
                return res.status(404).send();
            else {
                const now = new Date();
                const bri = user.toObject();
                    let todayAppointments = bri.briInfo.appointment.filter(app => {
                        const dateApp = new Date(app.timeSlot.departureTime);
                        return dateApp.getDate() === now.getDate() && dateApp.getMonth() === now.getMonth() && dateApp.getFullYear() === now.getFullYear();
                    });
                    let endTime = new Date(0);
                    todayAppointments.forEach(app =>
                        app.available.forEach( av =>{
                            const stud = av.reservedBy;
                            if(stud !== undefined){
                                if(stud.studentInfo.appointment.status === 'waiting'){
                                    endTime = stud.studentInfo.appointment.timeSlot.departureTime;
                                }
                            }
                        }));
                    if(endTime === new Date(0)) {
                        return res.status(400).send();
                    }
                    else {
                        const del = now.getTime() - endTime.getTime();
                        const del1 = msToTime(del);
                        return res.status(200).json({delay: del1})
                    }

            }
        })
};

exports.getTodayAppointment = (req,res) => {
    UserModel.findById(req.params.id).populate({path: 'briInfo.appointment.available.reservedBy',
        select: 'firstName lastName studentInfo.major studentInfo.appointment.status studentInfo.appointment.timeSlot.departureTime'})
        .exec((err, user) => {
            if(err || user === null)
                return res.status(404).send();
            else {
                const result = [];
                const today = new Date();
                for (let app of user.briInfo.appointment) {
                    const appDate = new Date(app.timeSlot.departureTime);
                    if(appDate.getDate() === today.getDate() && appDate.getMonth() === today.getMonth()
                    && appDate.getFullYear() === today.getFullYear()){
                        for (let av of app.available) {
                            if(av.reservedBy!== undefined){
                                result.push({
                                    "departureTime": av.slot.departureTime.getHours() + "H " + av.slot.departureTime.getMinutes() + "mn",
                                    "endTime": av.slot.endTime.getHours() + "H " + av.slot.endTime.getMinutes() + "mn",
                                    "status": av.reservedBy.studentInfo.appointment.status,
                                    "firstName": av.reservedBy.firstName,
                                    "lastName": av.reservedBy.lastName
                                })
                            }
                        }
                    }
                }
                return res.status(200).json({
                    "color": {
                        "status": {
                            "none": '#FFFFFF',
                            "waiting": '#98FB98',
                            "inProcess": '#00aeef',
                            "done": '#C0C0C0'
                        }
                    },
                    "showedName": {
                        "departureTime": "De",
                        "endTime": "À",
                        "firstName": "Prénom",
                        "lastName": "Nom",
                    },
                    "queue": result
                });
            }
        })
};

