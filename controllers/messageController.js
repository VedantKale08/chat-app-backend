const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!chatId || !content) {
    res.status(200).send({
      error: "Please pass chatId or content",
      status: false,
    });
    return;
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "fname lname image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fname lname email image",
    });
    message = await User.populate(message, {
      path: "chat.latestMessage",
    });
    message = await User.populate(message, {
      path: "chat.latestMessage.sender",
      select: "fname lname email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).send({
      data: message,
      status: true,
    });
  } catch (error) {
    res.status(200).send({
      error: "Something went wrong!",
      status: false,
      errorMessage: error.message,
    });
  }
});

const allMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "fname lname email image"
    ).populate("chat");

    res.status(200).send({
      data: message,
      status: true,
    });

  } catch (error) {
    res.status(200).send({
      error: "Something went wrong!",
      status: false,
      errorMessage: error.message,
    });
  }
});

module.exports = { sendMessage, allMessage };
