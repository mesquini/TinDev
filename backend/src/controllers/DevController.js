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

    try{
        const {data : response} = await axios.get(`https://api.github.com/users/${username}`)

        var {name, bio, avatar_url : avatar, html_url : url_github, company, email, blog} = response

        name = (name === null ? username : name)
        bio = (bio === null ? 'Biografia não informada' : bio)
        
        const dev_value = await dev.create({
                name,
                user: username,
                bio,
                avatar,
                company,
                blog,
                email,
                url_github
        })

        return res.json(dev_value)

        }catch({message}){            
            return res.json({'status' : message})
        }
    },

    async delete(req, res) {
        const  {devId} = req.params

        await dev.findByIdAndDelete(devId)

        return res.json({'Status' : 'Usuario deletado com sucesso'})
    }  
}