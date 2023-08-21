const mongooes = require("mongoose");

const messageModel = mongooes.Schema(
  {
    sender: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongooes.model("Message", messageModel);

module.exports = Message;
