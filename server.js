const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const {v4:uuid4} = require('uuid')

const port = process.env.PORT || 8800


app.use(express.static(__dirname+'/views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.get('/', (req,res) =>{
    res.render('index')
})

app.get('/home', (req,res) =>{
    res.render('home')
})

app.get('/:id', (req,res) => {
    res.render('index')
})






io.sockets.on('connection', socket => {
    // io.sockets.emit('update_notes_for_new_users',notes_text)

    socket.on('update_notes_for_current_users',(data,roomId) =>{
        // console.log(roomId)
        // socket.join(roomId)
        console.log(data)
        io.to(roomId).emit('update_notes_for_current_users',data)
        // console.log(data,roomId,socket.id)
        var clients = io.sockets.adapter.rooms;
        console.log(clients)
        console.log(socket.id)
    })

    socket.on('create_new_room', (roomId) =>{
        // const roomId = uuid4()
        socket.join(roomId)
        // io.to(roomId).emit('send-roomId',roomId)
        console.log("user created room",socket.id)
    })

    socket.on('join_room', (roomId) =>{
        socket.join(roomId)
        // io.to(roomId).emit('send-roomId',roomId)
        console.log("user joined room",socket.id)
    })

})



server.listen(port)
