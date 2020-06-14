const users = []

// addUser, removeUser, getUser, getUsersInRoom


const addUser = ({id, username, room}) =>{
    
    // clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room){
        return {
            error : "Username and room are required"
        }
    }
    
    // check  for  existing user
    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })
    // validate user name

    if (existingUser) {
        return {
            error: "User name is in use"
        }
    }

    // store user

    const user = {id, username, room}
    users.push(user)
    return {  user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user) =>{
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) =>{
    return users.filter((user) => user.room === room)
}
addUser({
    id : 22,
    username: 'Rahul  ',
    room : 'Noida'
})

addUser({
    id : 42,
    username: 'Kavita  ',
    room : 'Noida'
})

addUser({
    id : 32,
    username: 'Rahul  ',
    room : 'GBN'
})

//const getuser = getUser(32)

//console.log(getuser)

//const userList = getUsersInRoom('tpn')

//console.log(userList)

// // const res = addUser({
// //     id: 23,
// //     username : "rahul",
// //     room : "noida"
// // })

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)
// //console.log(res)



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}