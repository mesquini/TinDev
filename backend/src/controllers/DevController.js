const axios = require('axios')
const dev = require('../models/Dev')

module.exports = {

    async index(req, res){
        const { user } = req.headers

     const loggeDev = await dev.findById(user)

     const users = await dev.find({
         $and:[
             { _id : { $ne : user }},
             { _id : { $nin : loggeDev.likes }},
             { _id : { $nin : loggeDev.dislikes }},                

         ],
     })
    return res.json(users)
    },
    
    async store(req, res){
    const {username} = req.body

    const userExists = await dev.findOne({user : username})

    if(userExists)
        return res.json(userExists)

    const {data : response} = await axios.get(`https://api.github.com/users/${username}`)

    const {name, bio, avatar_url : avatar} = response

    const dev_value = await dev.create({
        name,
        user: username,
        bio,
        avatar,
    })
    
        return res.json(dev_value)
    }  
}