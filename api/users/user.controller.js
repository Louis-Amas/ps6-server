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
      res.status(400).send(err);
    });
};

exports.update = (req, res) => {
   
    UserModel.findById(req.params.id)
        .then(user => {
            for (let property in req.body) {
                user[property] = req.body[property]
                if (property === 'newPassword') {
                    const salt = crypto.randomBytes(16).toString("base64");
                    const hash = crypto
                      .createHmac("sha512", salt)
                      .update(req.body.newPassword)
                      .digest("base64");
                    user.password = salt + "$" + hash;
                }
            }
            user.save((err, updatedUser) => {
                if (err)
                    res.status(400).send(err);
                else {
                    delete updatedUser.password;
                    res.status(200).json(updatedUser);
                }
            });
        })
        .catch(err => {
            res.status(404).json(err);
        });
}

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByEmail(req.body.email).then(user => {
    if (!user) {
      res.status(404).send({});
    } else {
      let passwordFields = user.password.split("$");
      let salt = passwordFields[0];
      let hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
      if (hash === passwordFields[1]) {
        req.body.passwordHash = hash;
        return next();
      } else {
        return res.status(400).send({ errors: ["Invalid email or password"] });
      }
    }
  });
};
