const router = require("express").Router();
const Article = require("../models/Article");
const articleController = require("../controllers/articleController");
const auth = require("../middlewares/auth");

// GET /api/articles
// Returns most recent articles globally by default, provide tag, author or favorited query parameter to filter results

router.get( "/", auth.authOpt, articleController.globalFeed );

// Query Parameters:

// Filter by tag:

// ?tag=AngularJS

// Filter by author:

// ?author=jake

// Favorited by user:

// ?favorited=jake

// Limit number of articles (default is 20):

// ?limit=20

// Offset/skip number of articles (default is 0):

// ?offset=0

// Authentication optional, will return multiple articles, ordered by most recent first


//! Feed Articles
// GET /api/articles/feed
router.get( "feed", auth.verifyToken, articleController.articleFeed );

// Can also take limit and offset query parameters like List Articles

// Authentication required, will return multiple articles created by followed users, ordered by most recent first.


router.post( '/', auth.verifyToken, articleController.createArticle );

// PUT /api/articles/:slug
router.put( '/:slug',  auth.verifyToken, articleController.updateArticle );

// single article
router.get( '/:slug', auth.authOpt, articleController.singleArticle );

//delete articles/slug
router.delete( '/:slug', auth.verifyToken, articleController.deleteAtricle );

//POST /api/articles/:slug/favorite
router.post( '/:slug/favorite', auth.verifyToken, articleController.favoriteArticle )


router.get( "/", async ( req, res, next ) => {
    try {
        const article = await Article.find();
        res.json({article});
    } catch (error) {
        return next ( error )
    }
} )

module.exports = router;