const dev = require('../models/Dev')
const match = require('../models/Match')

module.exports = {
    async store(req, res){

        const { devId } = req.params
        const { user } = req.headers
         
        const loggeDev = await dev.findById(user) //retorna o json do usuario que encontra no bd
        const targetDev = await dev.findById(devId)

        if(!targetDev){
            return res.status(400).json({erro: 'Dev not exists'})
        }
        if(targetDev.likes.includes(loggeDev._id)){

            await match.create({
                loggerId : loggeDev._id,
                targetId : targetDev._id,
                visualizado : false
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

        loggeDev.likes.push(targetDev._id)
        await loggeDev.save()

        return res.json(loggeDev)
    },
    async match(req, res){
        const { devId } = req.params

        const objMatch = await match.find({$or: [{targetId : devId}, {loggerId : devId}]})
        
        return res.json(objMatch)
    }
}