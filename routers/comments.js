const mongoose = require('mongoose');
const express = require('express');
const commentsRouter = express.Router();

let bodyParser = require('body-parser');

let jsonParser = bodyParser.json();

mongoose.connect(
	'mongodb+srv://admin:password1234@cluster0.itss7tr.mongodb.net/cinema'
);

const Comment = require('../model/Comment.js');

commentsRouter.get('/', async (req, res) => {
	try {
		let query = {};
		let comments;
		let page = parseInt(req.query.page);
		let limit = parseInt(req.query.limit);
		if (req.query['movieId'] !== undefined) {
			query = { movie_id: req.query['movieId'] };
		}

		comments = await Comment.find(query)
			.skip(page * limit)
			.limit(limit);

		res.json(comments);
	} catch (error) {
		console.error(error);
	}
});

commentsRouter.get('/:id', async (req, res) => {
	try {
		let commentById = await Comment.findById(req.params.id);
		if (commentById === null) {
			res.status(404).json({ error: 'Comment not found' });
		} else {
			res.json(commentById);
		}
	} catch (error) {
		console.error(error);
	}
});

commentsRouter.post('/', jsonParser, async (req, res) => {
	try {
		//console.log(`This is the request: ${req.body}`);
		const name = req.body.name;
		const email = req.body.email;
		const createdAt = req.body.date;
		const text = req.body.text;
		const movie_id = req.body.movie_id;
		const newComment = new Comment({
			name: name,
			email: email,
			movie_id: movie_id,
			text: text,
			createdAt: createdAt,
		});

		const savedNewComment = await newComment.save();
		res.json(savedNewComment);
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

commentsRouter.patch('/:id', jsonParser, async (req, res) => {
	try {
		console.log(req.body);
		let itemToChange = req.params.id;

		const name = req.body.name;
		const email = req.body.email;
		const createdAt = Date.now();
		const text = req.body.text;
		const movie_id = req.body.movie_id;

		await Comment.findByIdAndUpdate(itemToChange, {
			name,
			email,
			createdAt,
			text,
			movie_id,
		});
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

commentsRouter.delete('/:id', jsonParser, async (req, res) => {
	try {
		console.log(req.body);
		let itemToChange = req.params.id;

		await Comment.findByIdAndDelete(itemToChange);
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

module.exports = commentsRouter;
