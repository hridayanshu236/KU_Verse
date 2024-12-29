const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { isAuth } = require("../middleware/isAuthenticated");
router.post("/bookmarks", isAuth, bookmarkController.addPostToGroup);
router.get("/bookmarks/groups", isAuth, bookmarkController.getBookmarkGroups);
router.post(
  "/bookmarks/groups",
  isAuth,
  bookmarkController.createBookmarkGroup
);
router.get(
  "/bookmarks/groups/:groupId/posts",
  isAuth,
  bookmarkController.getGroupPosts
);

module.exports = router;
