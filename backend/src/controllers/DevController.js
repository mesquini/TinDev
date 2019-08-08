const axios = require('axios')
const dev = require('../models/Dev')

module.exports = {
    async store(req, res){
    const {username} = req.body

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