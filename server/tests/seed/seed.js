const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [
  {
    _id: userOneID,
    email: "joris@example.com",
    password: "UserOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign(
            {
              _id: userOneID,
              access: "auth"
            },
            "abc123"
          )
          .toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "jen@example.com",
    password: "userTwoPass"
  }
];

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

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
