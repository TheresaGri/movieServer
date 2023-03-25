const mongoose = require("mongoose");
const { Schema, model } = mongoose;

let commentSchema = new Schema({
  name: String,
  email: String,
  movie_id: { type: Schema.Types.ObjectId, ref: 'Film' },
  text: String,
  date: Date,
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;