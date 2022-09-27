var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema =  new Schema ( {
    body: { type: String, minlength:1, required: true },
    author: String,
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    articleId: { type: Schema.Types.ObjectId, ref: 'article' }
} )

module.exports = mongoose.model( "Comment", commentSchema );