const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        validate: {
            validator: (email) => {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return email.match(emailRegex);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    birthDate: {
        type: Date,
        required: [true, 'birth date is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    createAt: {
        type: Date,
        default: new Date()
    },
    lastConnection: Date,
    role: {
        type: String,
        enum: ["bri", "prof", "student"],
        required: [true, 'roleis required']
    }
});

mongoose.model('user', UserSchema);