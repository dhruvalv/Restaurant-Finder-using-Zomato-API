const
    bodyParser = require('body-parser'),
    express = require('express'),
    path = require('path'),
    app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', '/client')))

app.use(require('./api/routes')())

const 
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server)

server.listen(8080, () => {
     console.log('Server is running')
})


let history = []
io.on('connection', socket => {

    socket.on('history-added', item => {
        history.push(item);
        io.emit('newhistorylist', history);
    });

    socket.on('clearHistory',() => {
        history = [];
    })
})