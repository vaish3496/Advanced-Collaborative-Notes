const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)


const port = process.env.PORT || 8800




app.use(express.static(__dirname+'/views'))

app.get('/', (req,res) =>{
    res.render('index')
})

var notes_text



io.sockets.on('connection', socket => {
    io.sockets.emit('update_notes_for_new_users',notes_text)

    socket.on('update_notes_for_current_users',(data) =>{
        notes_text = data
        io.sockets.emit('update_notes_for_current_users',notes_text)
    })
})



server.listen(port)
