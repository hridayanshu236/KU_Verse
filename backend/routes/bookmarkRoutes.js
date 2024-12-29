const express = require("express");
const router = express.Router();
const {
  createBookmarkGroup,
  getBookmarkGroups,
  addPostToGroup,
  getGroupPosts,
} = require("../controllers/bookmarkController");
const { isAuth } = require("../middleware/isAuthenticated");
router.post("/bookmarks", isAuth, addPostToGroup);
router.get("/bookmarks/groups", isAuth, getBookmarkGroups);
router.post("/bookmarks/groups", isAuth, createBookmarkGroup);
router.get("/bookmarks/groups/:groupId/posts", isAuth, getGroupPosts);

module.exports = router;
