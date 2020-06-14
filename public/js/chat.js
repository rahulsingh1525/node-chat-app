const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')


const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () =>{
    // new message
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messagescontainer
     const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message) =>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:m a' )
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage', (message) =>{
    console.log(message)
    const html = Mustache.render(locationTemplate,{
       username : message.username,
       url : message.url,
       createdAt : moment(message.createdAt).format('h:m a') 
    })
    $location.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('roomData', ({users, room}) =>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled',  'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('The message was delivered', message)
    })
})


document.querySelector('#send-location').addEventListener('click', () =>{
    if(!navigator.geolocation){
        console.log('Geo location not  supported by browser')
    }
    $sendLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) =>{
        const geoCordinates = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }
       // console.log(geoCordinates)
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },() =>{
            $sendLocation.removeAttribute('disabled')
            
            console.log('Location shared')
        })
    })
})

socket.emit('join',{username, room}, (error) =>{
    if(error){
        alert(error)
        location.href = './'
    }
})