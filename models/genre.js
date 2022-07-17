var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var genreSchema = new Schema(
    {
        title: {type:String, required:true},
        description: {type:String, required:true}
    }
);

genreSchema.virtual("url").get(function(){
    return "/genres/"+this._id;
});

module.exports = mongoose.model("Genre", genreSchema);