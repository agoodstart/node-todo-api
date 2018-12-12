const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// const id = "5c10186fa5b0b13d68311a41";

// if (!ObjectID.isValid(id)) {
//   console.log("ID not valid");
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo", todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("Id not found");
//     }
//     console.log("Todo by Id", todo);
//   })
//   .catch(e => console.log(e));

const id = "5c0fa39d1b580747549659e5";

User.findById(id)
  .then(user => {
    if (!user) {
      return console.log("User not found");
    }
    console.log("User by Id:", user);
  })
  .catch(e => console.log(e));
