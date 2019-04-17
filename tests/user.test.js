const request = require("request");

const User = {
  firstName: 'Louis',
  lastName: 'Amas',
  birthDate: '2019-03-21T17:33:07',
  email: 'amaslouis@gmail.com',
  password: '123',
  role: 'student'
};

const urlUser = 'http://127.0.0.1:9428/api/users';
let options = {
  method: 'POST',
  url: urlUser,
  headers: {'content-type': 'application/json'},
  json: true
};

let id;
options.body = User;
describe('user', () => {
  test('create user', done => {
    request(options, function (error, response, body) {
      expect(body.firstName).toBe('Louis');
      if (body.firstName)
        id = body._id;
      done();
    });
  });

  test('create user with already existing email', done => {
    request(options, function (error, response, body) {
      !expect(body.firstName).toBe('Louis');
      done();
    });
  });

  test('update user', (done) => {
    options.body = {firstName: 'Bo'};
    options.method = 'PUT';
    options.url += `/${id}`;
    options.headers.Authorization = `${User.email}:${User.password}`;
    request(options, function (error, response, body) {
      expect(body.firstName).toBe('Bo');
      done();
    });
  });

  test('find by id', done => {
    options.method = 'GET';
    request(options, function (error, response, body) {
      expect(body.firstName).toBe('Bo');
      done();
    });
  });
  test('delete user', (done) => {
    options.method = 'DELETE';
    request(options, function (error, response, body) {
      expect(body.firstName).toBe('Bo');
      done();
    });
  });
});


