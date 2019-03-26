const crypto = require("crypto");
const UserModel = require("../../models/User");


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
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  UserModel.createUser(req.body)
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      if (err.code === 11000)
        res.status(400).send({"errors": {
          "msg": "Email already taken"
        }});
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

/*exports.minimumPermissionLevelRequired = (permissionLevel) => (req, res, next) => {
  if (req.permission & permissionLevel) {
    return next();
  }
  return res.status(401).json({errors: {
    error: {
      "message": "Insufficient permission"
    }
  }});
};*/

exports.isAuth = (req, res, next) => {
  const credidentials = req.get('Authorization').split(':');
  if (!credidentials)
    return res.status(401);
  req.body.email = credidentials[0];
  req.body.password = credidentials[1];
  return next();
};

exports.isPasswordAndEmailMatch = (req, res, next) => {
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
        req.body.passwordHash = hash;
        return next();
      } else {
        return res.status(401).send({ errors: ["Invalid email or password"] });
      }
    }
  });
};
