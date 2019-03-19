const mongoose = require('mongoose');
const UniversitySchema = require('../models/University');

mongoose.connect('mongodb://localhost/ps6', { useNewUrlParser: true});
mongoose.set('debug', true);

const University = mongoose.model('university');

uni1 = new University({name: `Polytech'Nice Sophia`, 
                    country: 'France', 
                    concerned_departement: [
                        'SI',
                        'GB'
                    ],
                    url_to_website: 'http://polytech.fr'}
                    )
uni1.save();
        
