const express = require("express");
const {
  loginUser,
  registerUsers,
  currentUsers,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", registerUsers);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUsers);

module.exports = router;
