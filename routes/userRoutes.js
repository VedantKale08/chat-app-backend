const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  allUser,
  getUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(authUser);

router.route("/get-all-user").get(protect,allUser);

router.route("/user").get(protect,getUser);

module.exports = router;
