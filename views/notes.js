const socket = io('https://collaborative-notes.herokuapp.com/')
// const socket = io('http://localhost:8800')

var textarea_notes = document.getElementById('textarea_notes')


socket.on('update_notes_for_new_users', (notes_text) =>{
    textarea_notes.value = notes_text;
})


textarea_notes.addEventListener('keyup' , () => {
    setTimeout(() => {
        socket.emit('update_notes_for_current_users',textarea_notes.value)
    }, 1500);
})

socket.on('update_notes_for_current_users',(notes_text) =>{
    textarea_notes.value = notes_text;
    console.log(notes_text)
})