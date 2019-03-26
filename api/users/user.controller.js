const crypto = require("crypto");
const UserModel = require("../../models/User");
const StudentModel = require("../../models/Student");

exports.get = (req, res) => {
    UserModel.find().then(result => {
        res.status(200).json(result);
    })
};

exports.delete = (req, res) => {
    UserModel.findById(req.params.id)
        .then((user) => {
            user.remove();
            return res.status(200).json(user);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(404).json(err);
        });
};

exports.insert = (req, res) => {
    if (!req.body.password)
        return res.status(400);
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
    req.body.password = salt + "$" + hash;
    UserModel.createUser(req.body)
        .then(result => {
            const student = new StudentModel({
               userId: result.id
            });
            student.save()
                .then(newStudent => {
                    let response = Object.assign({}, result)._doc;
                    response.studentId = newStudent._id;
                    delete response.__v;
                    delete response.password;
                    return res.status(201).json(response);
                });


        })
        .catch(err => {
            if (err.code === 11000)
                return res.status(400).send({
                    "errors": {
                        "msg": "Email already taken"
                    }
                });
        });
};

exports.update = (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {

            if (req.body['newPassword']) {
                const salt = crypto.randomBytes(16).toString("base64");
                const hash = crypto
                    .createHmac("sha512", salt)
                    .update(req.body.newPassword)
                    .digest("base64");
                user.password = salt + "$" + hash;

            }
            delete req.body.password;
            delete req.body.newPassword;

            for (let property in req.body)
                user[property] = req.body[property];

            user.save((err, updatedUser) => {
                if (err) res.status(400).send(err);
                else {
                    delete updatedUser.password;
                    res.status(200).json(updatedUser);
                }
            });
        })
        .catch(err => {
            res.status(404).json(err);
        });
};

exports.isAuthUserOwner = (req, res, next) => {
    if (req.body.connectedUser._id.toString() === req.params.id)
        return next();
    return res.status(401).json("Unauthorized");
};

/**
 * Check if user has set Authorization headers
 * if email and password is correct set req.body.connectedUser to current user
 * @param req
 * @param res
 * @param next
 * @return {*|Promise<any>}
 */
exports.isAuth = (req, res, next) => {
    const authorization = req.get('Authorization');
    if (authorization === undefined)
        return res.status(401).json('Auth error');
    const credidentials = authorization.split(':');

    req.body.email = credidentials[0];
    req.body.password = credidentials[1];



    UserModel.findByEmail(req.body.email).then(user => {
        if (!user) {
            res.status(404).send({});
        } else {
            const passwordFields = user.password.split("$");
            const salt = passwordFields[0];
            const hash = crypto
                .createHmac("sha512", salt)
                .update(req.body.password)
                .digest("base64");
            if (hash === passwordFields[1]) {
                req.body.connectedUser = user;
                return next();
            } else {
                return res.status(401).send({errors: ["Invalid email or password"]});
            }
        }
    });
};
