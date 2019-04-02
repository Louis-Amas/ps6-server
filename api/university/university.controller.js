const UniversityModel = require("../../models/University")

exports.get = (req, res) => {
    UniversityModel.find().then(university => {
        return res.status(200).json(university);
    })
};

exports.insert = (req, res) => {
    const univ = new UniversityModel(req.body);
    univ.save()
        .then(university => {
            return res.status(201).json(university);
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

exports.getByCountryAndMajor = (req, res) => {
    UniversityModel.findByCountry(req.params.country, req.params.concernedDepartment)
        .then(university => {
            return res.status(200).json(university);
        })
        .catch( (err) => {
            return res.status(404).json(err);
        })
};
