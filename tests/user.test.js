const mongoose = require("mongoose");

const UserSchema = require("../models/User");

const User = mongoose.model("user");


beforeAll(done => {
    mongoose.connect("mongodb://localhost/ps6-test", { useNewUrlParser: true, useCreateIndex: true });
    mongoose.set("debug", true);
    done();
});

beforeEach((done) => {
    mongoose.connection.collections['users'].drop(err => {
        done();
    });
});


test('add one user to db', (done) => {
    u1 = new User({
        firstName: 'Louis',
        lastName: 'Amas',
        birthDate: new Date("1998:03:19"),
        email: 'amaslouis@gmail.com',
        password: '123',
        role: 'student'
    });

    const check = (data) =>  {
        expect(data).toBe(null);
        done();
    }
    u1.save(check);
    
});

