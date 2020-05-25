const express = require('express');
const app = express();



const http = require('http').Server(app);
const io = require('socket.io')(http);



app.get('/', (req, res) => {
    res.send('Hello World');
    io.emit('commit', 'My First Commit');
});




app.listen(process.env.PORT || 8080, () => {
	console.log('server is running on port 8080');
});
å
