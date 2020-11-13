const socket = io('https://collaborative-notes.herokuapp.com/')
var textarea_notes = document.getElementById('textarea_notes')


socket.on('update_notes_for_new_users', (notes_text) =>{
    textarea_notes.value = notes_text;
})


textarea_notes.addEventListener('keyup' , () => {
    socket.emit('update_notes_for_current_users',textarea_notes.value)  
})

socket.on('update_notes_for_current_users',(notes_text) =>{
    textarea_notes.value = notes_text;
})