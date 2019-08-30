const dev = require('../models/Dev')
const match = require('../models/Match')


module.exports = {
    async store(req, res){

        const { devId } = req.params
        const { user } = req.headers
        
        await dev.updateOne({_id : user}, {$set : {super_like : false}}, {upsert : true})

        const loggeDev = await dev.findById(user) //retorna o json do usuario que encontra no bd
        const targetDev = await dev.findById(devId)

        if(!targetDev){
            return res.status(400).json({erro: 'Dev not exists'})
        }
        if(targetDev.superlikes.includes(loggeDev._id) || targetDev.likes.includes(loggeDev._id))
        {
            await match.create({
                match : [loggeDev._id, targetDev._id],
            })

            const loggeSocket = req.connectedUsers[user]
            const targetSocket = req.connectedUsers[devId]
            
            if(loggeSocket){
                req.io.to(loggeSocket).emit('match', targetDev)
            }
            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggeDev)
            }       
        }

        loggeDev.superlikes.push(targetDev._id)
        await loggeDev.save()

        const loggeSocket = req.connectedUsers[user]

        if(loggeSocket){
            req.io.to(loggeSocket).emit('superlike', loggeDev)
        }
        
        return res.json(loggeDev)
    }

}