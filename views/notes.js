const socket = io('https://collaborative-notes.herokuapp.com/')
var textarea_notes = document.getElementById('textarea_notes')


socket.on('update_notes_for_new_users', (notes_text) =>{
    textarea_notes.value = notes_text;
})

var timeoutRef;

textarea_notes.addEventListener('keyup' , () => {
    if(timeoutRef){
        clearTimeout(timeoutRef)
    }    
    timeoutRef =  document.setTimeout(() => {
        socket.emit('update_notes_for_current_users',textarea_notes.value)
    }, 2000);
})

socket.on('update_notes_for_current_users',(notes_text) =>{
    textarea_notes.value = notes_text;
})