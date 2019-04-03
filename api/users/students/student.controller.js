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
    const pos = student.studentInfo.wishes.find(w => w.universityId.equals(univId)).position;
    student.studentInfo.wishes
        .forEach( w => {
            if(w.position >= pos)
                w.position -= 1;
        });
    student.studentInfo.wishes.splice(pos-1, 1);
    return student;
};

const attachUniversity = (wishList) => {
    const wishes = wishList.toObject();
    const promise = wishes.map(w => {
        return UniversityModel.findById(w.universityId, (err, university) =>{
            w.university = university.toObject();
            delete w.university.courses;
            return w;
        });
    });
    return new Promise ((resolve, reject) => {
        Promise.all(promise).then(() => {
            return resolve(wishes);
        }).catch((err) => { return reject(err);});
    })
};

exports.get = (req, res) => {
    UserModel.find().populate({

    }).exec({role: 'student'}, (err, users) => {
        if (users === null)
          return res.status(200).json([]);
        users = users.map(students => formatStudent(students));
        return res.status(200).json(users);
    })
};


exports.insertWish = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
            if (err || user === null)
              return res.status(404).send();
            const student = user.toObject();
            console.log(student);
            req.body.position = student.studentInfo.wishes.length + 1;
            student.studentInfo.wishes.push(req.body);
            user.set(student);
            user.save()
                .then((user) => res.status(201).json(formatStudent(user)))
                .catch(err => res.status(400).json(err));
        })
};

exports.removeWish = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        if(err || user == null)
            return res.status(404).send();
        user.set(removeAndUpdateWish(user, req.params.univId));
        user.save()
            .then((user) => res.status(201).json(formatStudent(user)))
            .catch(err => res.status(400).json(err));
    })
};

exports.getWishes = (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        if(err || user == null)
            return res.status(404).send();
        attachUniversity(user.studentInfo.wishes).then( w => {
            return res.status(202).json(w);
        })
            .catch(() => {
                return res.status(404).send()
            });
    })
};
