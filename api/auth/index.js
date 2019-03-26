const { Router } = require('express');
const  UserController  = require('../users/user.controller');
const router = new Router();
const StudentModel = require('../../models/Student');

const attachStudent = (user) => {
    return new Promise((resolve, reject) => {
        StudentModel.findByUserId(user._id)
            .then(student => {
               const copy = Object.assign({}, user._doc);
               copy.wishes = student.wishes;
               copy.studentId = student._id;
               copy.suppDocs = student.suppDocs;
               delete copy.__v;
               delete copy.password;
               resolve({
                   connected: true,
                   user: copy
               });
            })
            .catch(err => {
               reject({
                   connected: false,
                   errros: err
               });
            });
    });
};

const attach = (req, res) => {

    if (req.body.connectedUser.role === 'student') {
        attachStudent(req.body.connectedUser)
            .then(result => {
                return res.status(200).json(result);
            })
            .catch(err => {
                res.status(400).json(err)
            });
    }
};

router.get('/',  [
    UserController.isAuth,
    attach
]);




module.exports = router;
