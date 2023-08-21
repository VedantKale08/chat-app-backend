const mongooes = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongooes.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userModel.pre('save', async function (next) {
  if(!this.isModified){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userModel.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongooes.model("User", userModel);

module.exports = User;
