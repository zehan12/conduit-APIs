const router = require("express").Router( { mergeParams: true } );
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/auth");

// POST /api/articles/:slug/comments
router.post( "/", auth.verifyToken, commentController.createComment );

// GET /api/articles/:slug/comments
router.get( "/", auth.verifyToken, commentController.getAllComment );

// DELETE /api/articles/:slug/comments/:id
router.delete( "/:commentId", auth.verifyToken, commentController.deleteComment );

module.exports = router;