const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Todo.deleteMany({}).then(result => {
//   if (!result.n) {
//     return console.log("Nothing to remove");
//   }

//   console.log(result.n);
// });

// Todo.findOneAndDelete({_id: '5c125f6945bbbd3c98d8f160'}).then(todo => {
//   console.log(todo)
// })

Todo.findByIdAndDelete("isehf")
  .then(todo => {
    if (!todo) {
      return console.log("Nothing to remove");
    }
    console.log(todo);
  })
  .catch(e => {
    if (e.name === "CastError") {
      return console.log("Invalid ObjectID");
    }
  });
