// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    // db.collection("Todos")
    //   .deleteMany({ text: "Eat lunch" })
    //   .then(
    //     todos => {
    //       console.log("Deleted todos: ", todo);
    //     },
    //     err => {
    //       console.log("Unable to fetch todos", err);
    //     }
    //   );

    // db.collection("Todos")
    //   .deleteOne({ _id: new ObjectID("5c0ecb52db25a422e4c0711d") })
    //   .then(
    //     todo => {
    //       console.log(`Todo deleted: ${todo}`);
    //     },
    //     err => {
    //       console.log("Unable to delete todo", err);
    //     }
    //   );

    // db.collection("Todos")
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result);
    //   });

    db.collection("Users")
      .deleteMany({ name: "Joris" })
      .then(
        result => {
          console.log("Users deleted");
        },
        err => {
          console.log("Unable to delete users");
        }
      );

    db.collection("Users")
      .findOneAndDelete({ _id: new ObjectID("5c0e4dd5ee8cc003e4e99a98") })
      .then(
        result => {
          console.log(`User deleted: ${result}`);
        },
        err => {
          console.log("Unable to delete user");
        }
      );

    // client.close();
  }
);
