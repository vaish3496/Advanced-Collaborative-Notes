const socket = io('https://collaborative-notes-io.herokuapp.com/')
// const socket = io('http://localhost:8800')
const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)



window.onload = ()=>{
    var create_room = document.getElementById('create_room')
    // var join_room = document.getElementById('join_room')
    var textarea_notes = document.getElementById('textarea_notes')
    // if(create_room){
    //     create_room.addEventListener('click', () =>{
    //         console.log('creating new room')
    //         socket.emit('create_new_room')
    //     });
    // }
    // if(join_room){
    //     join_room.addEventListener('click', () =>{
    //         const join_roomId = prompt('Enter Room ID')
    //         // socket.emit('join_room',join_roomId)
    //         window.location.href = `http://localhost:8800/${join_roomId}`
    //     })
        
    // }

    if(textarea_notes){
        socket.emit('create_new_room',getLastItem(window.location.href))
        // socket.emit('join_room',getLastItem(window.location.href))
        textarea_notes.addEventListener('keyup' , () => {
            // setTimeout(() => {
            //     socket.emit('update_notes_for_current_users',textarea_notes.value)
            // }, 1500);
            socket.emit('update_notes_for_current_users',textarea_notes.value,getLastItem(window.location.href))
        })
    }

}











// socket.on('send-roomId', roomId =>{
//     console.log('send-roomId')
//     window.location.href = `http://localhost:8800/${roomId}`
// })



socket.on('update_notes_for_new_users', notes_text =>{
    textarea_notes.value = notes_text;
})


socket.on('update_notes_for_current_users',notes_text =>{
    textarea_notes.value = notes_text;
    // console.log(notes_text,'are we here?',textarea_notes.value)
})