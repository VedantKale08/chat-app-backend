const mongooes = require("mongoose");

const chatModel = mongooes.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, trim: true },
    users: [
      {
        type: mongooes.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: [
      {
        type: mongooes.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    groupAdmin: {
      type: mongooes.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongooes.model('Chat',chatModel);

module.exports = Chat;