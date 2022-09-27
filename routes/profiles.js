const router = require("express").Router();
const profilesRouter = require('../controllers/proflieController');
const auth = require('../middlewares/auth');

// GET /api/profiles/:username
router.get( '/:username', auth.authOpt, profilesRouter.getUsername  );

// POST /api/profiles/:username/follow
router.post( '/:username/follow', auth.verifyToken, profilesRouter.followUser );

// DELETE /api/profiles/:username/follow
router.delete( '/:username/follow', auth.verifyToken, profilesRouter.unfollowUser );

module.exports = router;