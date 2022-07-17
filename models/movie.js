var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var movieSchema = new Schema(
    {
        title: {type:String, required:true},
        director: {type:String, required:true},
        year: {type:Number, min:1800, max:2100},
        description: {type:String, required:true},
        image: {type:String, required:true},
        starring: {type:String, required:true},
        genres: [{type:Schema.Types.ObjectId, ref:"Genre"}],
        available:{type:String}
    }
);

movieSchema.virtual("url").get(function(){
    return '/movies/' + this._id;
});

module.exports = mongoose.model("Movie", movieSchema);