const UniversityModel = require("../../models/University")

exports.get = (req, res) => {
    UniversityModel.find().then(university => {
        return res.status(200).json(university);
    })
};

exports.insert = (req, res) => {
    console.log(req.body);
    UniversityModel.createUniversity(req.body)
        .then(university => {
            res.status(201).json(university);
        })
        .catch(err => {
            if (err.code === 11000)
                return res.status(400).send({
                    "errors": {
                        "msg": "Name already taken"
                    }
                });
        });
};
