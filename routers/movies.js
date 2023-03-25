const mongoose = require('mongoose');
const express = require('express');
const moviesRouter = express.Router();

let bodyParser = require('body-parser');

let jsonParser = bodyParser.json();

//mongoose.connect('mongodb+srv://admin:Samuel@cluster0.aobh3oj.mongodb.net/');
// mongoose.connect(
// 	'mongodb+srv://theresagri:XcsNUtaP9GJdX3i@cluster0.jycu5sj.mongodb.net/cinema'
// );

const Film = require('../model/Film.js');

moviesRouter.get('/', async (req, res) => {
	try {
		let query = {};
		let movies;
		let sorting = {};
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		if (req.query['year'] !== undefined) {
			query = { year: req.query['year'] };
		}
		if (req.query['title'] !== undefined) {
			query = { ...query, name: { $regex: req.query['title'], $options: 'i' } };
		}

		if (req.query['sortAscending'] !== undefined) {
			if (req.query['sortAscending'] === 'year') {
				sorting = { year: 1 };
			}
		}
		if (req.query['sortDescending'] !== undefined) {
			if (req.query['sortDescending'] === 'year') {
				sorting = { year: -1 };
			}
		}

		if (req.query['genre'] !== undefined) {
			query = {
				...query,
				genres: { $regex: new RegExp(req.query['genre'], 'i') },
			};
		}
		movies = await Film.find(query)
			.sort(sorting)
			.skip(page * limit)
			.limit(limit);

		res.json(movies);
	} catch (error) {
		console.error(error);
	}
});

moviesRouter.get('/:id', async (req, res) => {
	try {
		let movieById = await Film.findById(req.params.id);
		if (movieById === null) {
			res.status(404).json({ error: 'Movie not found' });
		} else {
			res.json(movieById);
		}
	} catch (error) {
		console.error(error);
	}
});

moviesRouter.post('/', jsonParser, async (req, res) => {
	try {
		console.log(req.body);

		let name = req.body.name;
		let plot = req.body.plot;
		let genres = req.body.genres;
		let duration = req.body.duration;
		let year = req.body.year;
		let imdbRating = req.body.imdbRating;
		let poster = req.body.poster;

		let newFilm = new Film({
			name,
			plot,
			genres,
			duration,
			year,
			imdbRating,
			poster,
		});

		newFilm
			.save()
			.then((film) => res.json(film))
			.catch((err) => res.status(400).json({ success: false, err }));

		console.log('Movie successfully created');
	} catch (err) {
		console.log(err);
	}
});

moviesRouter.patch('/:id', jsonParser, async (req, res) => {
	try {
		console.log(req.body);
		let itemToChange = req.params.id;

		let name = req.body.name;
		let plot = req.body.plot;
		let genres = req.body.genres;
		let duration = req.body.duration;
		let year = req.body.year;
		let imdbRating = req.body.imdbRating;
		let poster = req.body.poster;

		await Film.findByIdAndUpdate(itemToChange, {
			name,
			plot,
			genres,
			duration,
			year,
			imdbRating,
			poster,
		});
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

moviesRouter.delete('/:id', jsonParser, async (req, res) => {
	try {
		console.log(req.body);
		let itemToChange = req.params.id;

		await Film.findByIdAndDelete(itemToChange);
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

module.exports = moviesRouter;
