const express = require("express");
const {
  createBookmarkGroup,
  getBookmarkGroups,
  addPostToGroup,
  getGroupPosts,
} = require("../controllers/bookmarkController");
const router = express.Router();
const { isAuth } = require("../middleware/isAuthenticated");
router.get("/groups", isAuth, getBookmarkGroups);
router.post("/groups", isAuth, createBookmarkGroup);
router.get("/groups/:groupId/posts", isAuth, getGroupPosts);
router.post("/", isAuth, addPostToGroup);

module.exports = router;
