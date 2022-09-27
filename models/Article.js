var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

var articleSchema = new Schema( { 
    title: { type: String, required: true },
    description: String,
    body: { type: String, required: true },
    tagList: [ { type: String } ],
    author: { type: Schema.Types.ObjectId, ref: "user", required:true },
    comments: [ { type: Schema.Types.ObjectId, ref: "comment" } ],
    favorites:[ { type: Schema.Types.ObjectId, ref: "user" } ],
    // likes: { type: Number, default: 0 },
    // likedBy: [ { type: Schema.Types.ObjectId, ref: "user" } ],
    slug: { type: String, unique: true, slug: "title", slug_padding_size: 3 }
}, { timestamps: true } );


module.exports = mongoose.model( "Article", articleSchema );