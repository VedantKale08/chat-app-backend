const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(200).json({
      error: "Please Pass user Id!",
      status: false,
    });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "fname lname email",
  });

  if (isChat.length > 0) {
    res.status(200).json({
      chat: isChat[0],
      status: true,
    });
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json({
        chat: FullChat,
        status: true,
      });
    } catch (error) {
      res.status(200).json({
        error: "Something went Wrong!",
        errorMessage: error,
        status: false,
      });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: {
        $elemMatch: { $eq: req.user._id },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "fname lname email",
        });
        res.status(200).send({
          data: results,
          status: true,
        });
      });
  } catch (error) {
    res.status(200).send({
      error: "Something went Wrong",
      errorMessage: error,
      status: false,
    });
  }
});

const createGroupChats = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  if (!users || !name) {
    res.status(200).send({
      error: "Please Pass user and group name",
      status: false,
    });
  }
  var groupUsers = JSON.parse(users);

  if (groupUsers.length < 2) {
    res.status(200).send({
      error: "More than 2 users are required to form a group!",
      status: false,
    });
  }

  groupUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: groupUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      data: fullGroupChat,
      status: true,
    });
  } catch (error) {
    res.status(200).send({
      error: "Something Went wrong",
      status: false,
    });
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).send({
      data: updatedChat,
      status: true,
    });
  } else {
    res.status(200).send({
      error: "Chat Not Found",
      status: false,
    });
  }
});

const updateChat = asyncHandler(async (req, res) => {
  const { chatId, users, chatName } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { users: JSON.parse(users) },
      chatName: chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (added) {
    res.status(200).send({
      data: added,
      status: true,
    });
  } else {
    res.status(200).send({
      error: "Chat Not Found",
      status: false,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChats,
  renameGroupChat,
  updateChat,
};
