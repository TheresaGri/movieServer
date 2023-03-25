const express = require('express');
const app = express();
const moviesRouter = require('./routers/movies.js');
const commentsRouter = require('./routers/comments.js');
const cors = require("cors")

app.use(cors())
app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);

let PORT = 3000;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
