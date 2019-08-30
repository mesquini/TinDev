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
        if(targetDev.likes.includes(loggeDev._id) || targetDev.superlikes.includes(loggeDev._id)){

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

        loggeDev.likes.push(targetDev._id)
        await loggeDev.save()

        return res.json(loggeDev)
    },
    async match(req, res){
        const { devId } = req.params

        const objMatch = await match.find({match : devId})

        for (const key in objMatch) {
            if  (objMatch.hasOwnProperty(key)) {
                const {match : id} = objMatch[key];

                for (var i=id.length-1; i>=0; i--) {
                    if (id[i] == devId) 
                        id.splice(i, 1);                    
                }
            }
        }
        var users = []        
        var id_matchs = []
        for (var i=objMatch.length-1; i>=0; i--) {             
            const {match : id, _id : id_match} = objMatch[i];       
            users[i] = await dev.findOne({_id : id})  
            id_matchs[i] = id_match
        }
        return res.json({users, id_matchs})
    },
    async delete(req, res){
        const {devId} = req.params
        const {matchid, targerid} = req.headers

        await match.findByIdAndDelete({_id : matchid})
        const loggeDev = await dev.findById({_id : devId})
        const targerDev = await dev.findById({_id : targerid})

        if(loggeDev.superlikes.length > 0 || targerDev.superlikes.length > 0){
            for (var i=loggeDev.superlikes.length-1; i>=0; i--) {
                if (loggeDev.superlikes[i] == targerid) 
                    loggeDev.superlikes.splice(i, 1)                 
            }
            for (var i=targerDev.superlikes.length-1; i>=0; i--) {
                if (targerDev.superlikes[i] == devId) 
                targerDev.superlikes.splice(i, 1)                 
            }
        }
        
        for (var i=loggeDev.likes.length-1; i>=0; i--) {
            if (loggeDev.likes[i] == targerid) 
                loggeDev.likes.splice(i, 1)                 
        }
        for (var i=targerDev.likes.length-1; i>=0; i--) {
            if (targerDev.likes[i] == devId) 
            targerDev.likes.splice(i, 1)                 
        }

        await loggeDev.save()            
        await targerDev.save()            
        
        return res.json({"Status": true})
    }
}