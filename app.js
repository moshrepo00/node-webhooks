const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const http = require('http').Server(app);
const io = require('socket.io')(http);



app.get('/', (req, res) => {
    res.send('Hello World');
    io.emit('commit', 'My First Commit');
});


app.post('/webhook', function(req, res) {
    io.emit('commit', req.body);
    res.status(200).send('Hook executed');
});



http.listen(process.env.PORT || 8080, () => {
	console.log('server is running on port 8080');
});
