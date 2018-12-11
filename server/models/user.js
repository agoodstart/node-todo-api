const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    required: true,
    trim: true,
    type: String,
    validate: {
      validator: function(v) {
        return v.includes("@");
      },
      message: props => `${props.value} is not a valid email!`
    }
  }
});

module.exports = {
  User
};
