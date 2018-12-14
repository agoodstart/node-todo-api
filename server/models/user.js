const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");

// const bla = {
//   email: 'joris@example.com',
//   password: 'myPass123',
//   tokens: [{
//     access: 'auth',
//     token: 'sdlsagdcsakjgdcjkdba'
//   }]
// }

const User = mongoose.model("User", {
  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      validator: isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = {
  User
};
