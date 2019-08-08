const dev = require('../models/Dev')

module.exports = {
    async store(req, res){

        const { devId } = req.params
        const { user } = req.headers
         
        const loggeDev = await dev.findById(user) //retorna o json do usuario que encontra no bd
        const targetDev = await dev.findById(devId)

        if(!targetDev){
            return res.status(400).json({erro: 'Dev not exists'})
        }

        loggeDev.dislikes.push(targetDev._id)
        await loggeDev.save()

        return res.json(loggeDev)
    }
}