const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Set up mongoose connection
const mongoose = require('mongoose');

// Set up mongoose connection
let dev_db_url = 'mongodb+srv://mos:test@cluster0-cgltt.mongodb.net/Commit-DB?retryWrites=true';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Commit = require('./commit.model');


const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});



app.get('/', (req, res) => {
    res.send('Hello World');
    io.emit('commit', 'My First Commit');
});

app.get('/commits', function(req, res) {
      Commit.find({}, function(err, commits) {
            if (err) return next(err);
            res.status(200).json(commits);
	    });
})


app.post('/webhook', function(req, res) {
    io.emit('commit', req.body);

    const commitInfo = req.body.push.changes[0].commits[0];

    const author = commitInfo.author.user.display_name;
    const date = commitInfo.message;
    const message = commitInfo.message;
    const hash = commitInfo.hash;


     let commit = new Commit({
        author: author,
        message: message,
        hash: hash,
        date: date
    });
    commit.save().then(data => {
        Commit.find({}, function(err, commits) {
            if (err) return next(err);
            res.status(200).json(commits);
	    });
    })
});




http.listen(process.env.PORT || 8080, () => {
	console.log('server is running on port 8080');
});
