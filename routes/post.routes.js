const router = require("express").Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadPostController = require("../controllers/uploadPost.controller");

router.get("/", postController.readPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);
router.post(
  "/upload-post",
  upload.single("file"),
  uploadPostController.uploadPostPicture
);

module.exports = router;
