const express = require("express");
const protect = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChats, renameGroupChat, updateChat } = require("../controllers/chatController");

const router = express.Router();

router.route('/access-chat').post(protect,accessChat);
router.route('/fetch-chats').get(protect,fetchChats);
router.route("/group").post(protect, createGroupChats);
router.route('/rename').put(protect,renameGroupChat);
router.route("/update-chat").put(protect, updateChat);

module.exports = router;
