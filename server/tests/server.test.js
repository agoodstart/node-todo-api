const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    const text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done();
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done();
        }
      });

    Todo.find()
      .then(todos => {
        expect(todos.length).toBe(2);
        done();
      })
      .catch(e => done(e));
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    const testID = new ObjectID();
    request(app)
      .get(`/todos/${testID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", done => {
    request(app)
      .get("/todos/123")
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if todo not found", done => {
    const testID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${testID}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", done => {
    request(app)
      .delete("/todos/123")
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    const testID = todos[0]._id.toHexString();
    const randomText = "Random text";

    request(app)
      .patch(`/todos/${testID}`)
      .expect(200)
      .send({ text: randomText, completed: true })
      .expect(res => {
        expect(res.body.todo.text).toEqual(randomText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).not.toBeNull();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(testID)
          .then(todo => {
            expect(res.body.todo.text).toEqual(todo.text);
            done();
          })
          .catch(e => done(e));
      });
    // Take the first todo and set its text to something else, should set completed to true
  });

  it("should clear completedAt when todo is not completed", done => {
    const testID = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${testID}`)
      .expect(200)
      .send({ completed: false })
      .expect(res => {
        expect(res.body.completed).not.toBe(true);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    const email = "example@example.com";
    const password = "123anb";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return validation error if request invalid", done => {
    const fakeEmail = "fake";
    const fakePassword = "fake";

    request(app)
      .post("/users")
      .send({ email: fakeEmail, password: fakePassword })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    request(app)
      .post("/users")
      .send({ email: users[0].email, password: "randompassword" })
      .expect(400)
      .end(done);
  });

  describe("POST /users/login", () => {
    it("should login user and return auth token", done => {
      request(app)
        .post("/users/login")
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(200)
        .expect(res => {
          // console.log(res);
          expect(res.headers["x-auth"]).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[0]._id)
            .then(user => {
              expect(user.tokens[0]).toMatchObject({
                access: "auth",
                token: res.headers["x-auth"]
              });
              done();
            })
            .catch(e => done(e));
        });
    });

    // it("should reject invalid login", done => {});
  });
});
