const { find } = require("../models/Article");
const Article = require("../models/Article");
const User = require("../models/User");
const Comment = require("../models/Comment")

// Example request body:

// {
//   "article": {
//     "title": "How to train your dragon",
//     "description": "Ever wonder how?",
//     "body": "You have to believe",
//     "tagList": ["reactjs", "angularjs", "dragons"]
//   }
// }

module.exports = {

    globalFeed: async ( req, res, next ) => {
        try {
            
        } catch ( error ) {
            return  next( error )
        }
    },
    
    articleFeed: async ( req, res, next ) => {
        try {
            const articlePerPage = req.query.limit || 0;
            const offset = !req.query.offset ? 3 : req.query.offset;
            const article = await Article.find( { author: { $in: req.users.userId } } )
                                         .sort( { createdAt: 1 } )
                                         .skip( articlePerPage * offset )
                                         .limit( articlePerPage );
            res.status(200).json( {article} );
            
        } catch ( error ) {
            return next( error )
        }
    },

    createArticle: async (req, res, next) => {
        try {
            const article = req.body;

            if ( req.body.title.trim().length === 0 || req.body.body.trim().length === 0 ) {
                // error
            }

            if (req.body.tagList) {
                console.log(req.body.tagList)
                article.tagList = req.body.tagList.map(v => v.toLowerCase());
                console.log(article)
            }

            article.author = req.users.userId;
            const articleCreated = await Article.create(article);
            const author = await User.findByIdAndUpdate(
                article.author,
                { $push: { articles: articleCreated.id } },
                { new: true }
            );
            console.log(author)
            res.status(201).json({
                article: {
                    title: articleCreated.title,
                    description: articleCreated.description,
                    body: articleCreated.description,
                    tagList: articleCreated.tagList,
                    author: {
                        username: author.username,
                        bio: author.bio,
                        image: author.image,
                        following: false
                    }

                }
            });
        } catch (error) {
            return next(error);
        }
    },

    updateArticle: async (req, res, next) => {
        try {
            const articleUpdate = req.body;
            console.log(articleUpdate)

            if ( req.body.title.trim().length === 0 ) {
                // return error
            }

            // if (req.body.title) {
            //     articleUpdate.article.slug = req.body.title
            //         .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
            //         .split(" ").join("-")
            //         .toLowerCase() + "-" + random();
            // }
            const { author } = await Article.findOne({ slug: req.params.slug });
            if (req.users.userId == author) {
                const articleUpdated = await Article.findOneAndUpdate(
                    { slug: req.params.slug },
                    articleUpdate,
                    { new: true }
                )
                res.json({ article: { articleUpdated } });
            } else {
                res.status(400).json({ error: "this article is not created by you" })
            }
        } catch (error) {
            return next(error);
        }
    },

    deleteAtricle: async (req, res, next) => {
        try {
            const { author } = await Article.findOne({ slug: req.params.slug });
            if (req.users.userId == author) {
                const articleDelete = await Article.findOneAndDelete({ slug: req.params.slug });
                const user = await User.findByIdAndUpdate(
                    req.users.userId,
                    { $pull: { articles: articleDelete.id } }
                );
                if ( user.favorites.includes(articleDelete.id) ) {
                    await  User.findByIdAndUpdate(
                         user.id,
                          { $pull: { favorties: articleDelete.id } } 
                    )
                }
                await Comment.deleteMany({ articleId: articleDelete.id });
                res.status(201).json({ articleDelete })
            } else {
                res.status(201).json({ error: "this article is not created by you" })
            }
        } catch (error) {
            return next(error)
        }
    },


    singleArticle: async (req, res, next) => {
        try {
            const slug = req.params.slug
            const article = await Article.findOne({ slug: slug })
                .populate({ path: 'author', model: User })
            const following = !req.users ? false :
                article.author.following.includes(req.users.userId);
            res.status(201).json({
                article:
                {
                    slug: article.slug,
                    title: article.title,
                    description: article.description,
                    body: article.body,
                    tagList: article.tagList,
                    createdAt: article.createdAt,
                    updatedAt: article.updatedAt,
                    favorited: article.favorited,
                    favoritedCount: article.favoritedCount,
                    author: {
                        username: article.author.username,
                        bio: article.author.bio,
                        image: article.author.image,
                        following: following
                    }
                }
            })
        } catch (error) {
            return next(error);
        }
    },

    favoriteArticle: async (req, res, next) => {
        try {
            const checkArticle = await Article.findOne({ slug: req.params.slug });

            if (!checkArticle) {
                return res.status(400).json({ errors: { body: [" No article found"] } });
            }

            if (checkArticle.favorited.includes(req.users.userId)) {
                res.status(400).json({ error: "this article already favorited by you" });
            } else {
                const favoritedArticle = await Article.findOneAndUpdate(
                    { slug: req.params.slug },
                    { $push: { favorited: req.users.userId } },
                    { new: true }
                );
                await User.findByIdAndUpdate(
                    id, { $push: { favorites: favoritedArticle.id } }
                );

                res.status(201).json({ favoritedArticle })
            }
        } catch (err) {
            return next(err)
        }
    },

    unfavoriteArticle: async (req, res, next) => {
        try {
            const checkArticle = await Article.findOne({ slug: req.params.slug });

            if (!checkArticle) {
                return res.status(400).json({ errors: { body: [" No article found"] } });
            }

            if (!checkArticle.favorited.includes(req.users.userId)) {
                res.status(400).json({ error: "this article already unfavorited by you" });
            } else {
                const unfavoritedArticle = await Article.findOneAndUpdate(
                    { slug: req.params.slug },
                    { $pull: { favorited: req.users.userId } },
                    { new: true }
                );
                await User.findByIdAndUpdate(
                    id, { $pull: { favorites: unfavoritedArticle.id } }
                );
                res.status(201).json({ unfavoritedArticle })
            }
        } catch (error) {
            return next(error)
        }
    }

}

