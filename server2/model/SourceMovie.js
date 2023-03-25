const { MongoClient } = require("mongodb");
const { Schema, model } = MongoClient;

let movieSchema = new Schema({
  _id: String,
  plot: String,
  genre: Array,
  runtime: Number,
  cast: Array,
  poster: String,
  title: String,
  fullplot: String,
  languages: Array,
  released: Date,
  directors: Array,
  rated: String,
  awards: Object,
  lastupdated: Date,
  year: Number,
  imdb: Object,
  countries: Array,
  type: String,
  tomatoes: Object,
});

const SourceMovie = model("SourceMovie", movieSchema);
module.exports = SourceMovie;
