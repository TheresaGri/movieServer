const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb+srv://admin:Samuel@cluster0.aobh3oj.mongodb.net/';

/* let SourceMovie = require("./model/SourceMovie.js");

 */
const client = new MongoClient(DB_URL);

async function migrateMovies() {
	let skip = 0;

	const databaseOfSourceMovies = client.db('sample_mflix');
	const collectionOfSourceMovies = databaseOfSourceMovies.collection('movies');
	let movies = await collectionOfSourceMovies
		.find({
			poster: { $exists: true },
			type: 'movie',
			'imdb.rating': { $gte: 8.5 },
		})
		.skip(skip)
		.limit(10)
		.toArray();

	const databaseOfFilms = client.db('cinema');
	const films = databaseOfFilms.collection('films');
	while (movies.length > 0) {
		for (const movie of movies) {
			const newFilm = {
				_id: movie._id,
				name: movie.title,
				plot: movie.plot,
				genres: movie.genres,
				duration: movie.runtime,
				year: movie.year,
				imdbRating: movie.imdb.rating,
				poster: movie.poster,
			};

			await films.insertOne(newFilm);
		}
		skip += 10;
		movies = await collectionOfSourceMovies
			.find({
				poster: { $exists: true },
				type: 'movie',
				'imdb.rating': { $gte: 8.5 },
			})
			.skip(skip)
			.limit(10)
			.toArray();
	}
}

async function migrateComments() {
	let skip = 0;
	const database = client.db('sample_mflix');
	const collectionOfComments = database.collection('comments');

	let comments = await collectionOfComments
		.find({})
		.skip(skip)
		.limit(10)
		.toArray();
	const databaseOfMovies = client.db('cinema');
	const collectionOfMovies = databaseOfMovies.collection('films');
	let movies = await collectionOfMovies.find({}).toArray();

	const newComments = databaseOfMovies.collection('comments');

	while (comments.length > 0) {
		for (const comment of comments) {
			for (const movie of movies) {
				if (comment.movie_id.equals(movie._id)) {
					const newComment = {
						_id: comment._id,
						name: comment.name,
						email: comment.email,
						movie_id: comment.movie_id,
						text: comment.text,
						date: comment.date,
					};
					await newComments.insertOne(newComment);
				}
			}
		}
		skip += 10;
		comments = await collectionOfComments
			.find({})
			.skip(skip)
			.limit(10)
			.toArray();
	}
}

// await migrateMovies();

// await migrateComments();

/* async function deleteComments() {
  const databaseOfMovies = client.db("cinema");
  const newComments = databaseOfMovies.collection("comments");
  await newComments.deleteMany();

}

 deleteComments();  */
