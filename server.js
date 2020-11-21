const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const {v4:uuid4} = require('uuid')
const fs = require('fs')
const {spawn} = require('child_process')
const { cpuUsage } = require('process')

const port = process.env.PORT || 8800

rooms_data = {}
editor_data = {}

app.use(express.static('public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


app.get('/', (req,res) =>{
    res.redirect('/home')
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
        // console.log(data)
        rooms_data[roomId] = data
        socket.broadcast.to(roomId).emit('update_notes_for_current_users',data)
        // console.log(data,roomId,socket.id)
        // var clients = io.sockets.adapter.rooms;
        // console.log(clients)
        // console.log(socket.id)
    })

    socket.on('update_editor_for_current_users',(data,roomId) =>{
        editor_data[roomId] = data
        socket.broadcast.to(roomId).emit('update_editor_for_current_users',data)
    })

    socket.on('create_new_room', (roomId) =>{
        // const roomId = uuid4()
        socket.join(roomId)
        if(!(roomId in editor_data)){
            editor_data[roomId] = ''
        }
        io.to(socket.id).emit('update_notes_for_new_users',rooms_data[roomId])
        io.to(socket.id).emit('update_editor_for_new_users',editor_data[roomId])
        // io.to(roomId).emit('send-roomId',roomId)
        // console.log("user created room",socket.id)
    })

    socket.on('run_python_script', (data,roomId) =>{
        const fileName = new Date().getTime().toString()+'.py'
        var output = ''
        fs.appendFile(`python/${fileName}`,data, function (err) {
            if (err) throw err;
          });
        const python = spawn('python',[`python/${fileName}`])
        python.stdout.on('data', (data) =>{
            // console.log(data.toString())
            output = output.concat(data.toString())
            // console.log(output)
        })
        python.on('close', (code) => {
            // console.log(`Exit code: ${code}`);
            output = output.concat(`Exit code: ${code}`)
            // console.log(output)
            socket.broadcast.to(roomId).emit('update_output_for_current_users',output)
            io.to(socket.id).emit('update_output_for_current_users',output)
            fs.unlink(`python/${fileName}`, function (err) {
                if (err) throw err;
              });
        })

        
    })

})



server.listen(port)
