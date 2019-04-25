const crypto = require("crypto");
const UserModel = require("../../models/User");

const formatUser = (user) => {
  const usr = user.toObject();
  delete usr.__v;
  delete usr.password;
  return usr;
};

exports.returnConnectedUser = (req, res) => {
  res.status(200).send(req.body.connectedUser);
};

exports.verifyPermissionsUser = (permission) =>
  (req, res, next) => {
    if (permission.includes(req.body.connectedUser.role))
      return next();
    return res.status(401).json({err: 'Not sufficient permission'});
  };

exports.get = (req, res) => {
  UserModel.find({}).populate('studentInfo.wishes.university').exec((err, users) => {
    users = users.map(user => formatUser(user));
    return res.status(200).json(users);
  })
};

exports.delete = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
    .then(user => {
      user.remove();
      return res.status(200).json(formatUser(user));
    })
    .catch(err => res.status(err.status).json(err.msg));
};

exports.getById = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
    .then(user => res.status(200).json(formatUser(user)))
    .catch(err => res.status(err.status).json(err.msg));
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
  console.log(req.body);
  UserModel.create(req.body)
    .then(user => {
      res.status(201).json(formatUser(user));
    })
    .catch(err => {
      if (err.code === 11000)
        return res.status(400).send({
          "errors": {
            "msg": "Email already taken"
          }
        });
      return res.status(400).json(err.message);
    });
};

exports.update = (req, res) => {
  UserModel.findByIdWithPostAndCourses(req.params.id)
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
          res.status(200).json(formatUser(updatedUser));
        }
      });
    })
    .catch(err => res.status(err.status).send(err.msg));
};

exports.isAuthUserOwner = (req, res, next) => {
  if (req.body.connectedUser._id.toString() === req.params.id || req.body.connectedUser.role === "teacher")
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
  })
    .catch(err => res.status(404).send(err));
};

exports.sendMessage = (req, res) => {
  UserModel.findById(req.params.id, (err, user1) => {
    if (err)
      return res.status(400).json(err);
    UserModel.findById(req.body.sendedTo, (err,user2) => {
      if (err)
        return res.status(400).json(err);
      const sender = user1.toObject();
      const receiver = user2.toObject();
      sender.sendedMessage.push(req.body);
      receiver.receivedMessage.push({receivedFrom: sender._id, content: req.body.content});
      user1.set(sender);
      user2.set(receiver);
      user1.save()
          .then(updatedUser => {
            user2.save()
                .then(() => {return res.status(201).json(formatUser(updatedUser))})
                .catch(err => {return res.status(400).json(err)});
          })
          .catch(err => {return res.status(400).json(err)});
    })
  })
};
