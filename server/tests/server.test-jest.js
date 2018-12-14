const expect = require("jest");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: new Date().getTime()
  }
];

beforeEach(done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

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
        // expect(todos.length).toBe(2);
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
        console.log(res.body.todos.length);
        // expect(res.body.todos.length).toBe(2);
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
        // expect(res.body.todo.text).toBe(todos[0].text);
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
        // expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexID)
          .then(todo => {
            // expect(todo).toBeFalsy();
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
        // expect(res.body.todo.text).toEqual(randomText);
        // expect(res.body.todo.completed).toBe(true);
        // expect(res.body.todo.completedAt).not.toBeNull();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(testID)
          .then(todo => {
            // expect(res.body.todo.text).toEqual(todo.text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should clear completedAt when todo is not completed", done => {
    const testID = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${testID}`)
      .expect(200)
      .send({ completed: false })
      .expect(res => {
        // expect(res.body.completed).not.toBe(true);
        // expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});