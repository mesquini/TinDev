const express = require('express')
const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const SuperLikeController = require('./controllers/SuperLikeController')
const DislikesController = require('./controllers/DeslikeController')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json( {message : 'Olá, Bem-Vindo ao TinDev, aonde você irá encontrar os'
    +' melhores programadores!'})
})

routes.get('/dashboard', DevController.index)
routes.get('/logge_dev', DevController.loggeDev)
routes.post('/dashboard', DevController.store)
//routes.delete('/dashboard/:devId', DevController.delete)
routes.put('/perfil', DevController.update)

routes.post('/dashboard/:devId/likes', LikeController.store)
routes.post('/dashboard/:devId/superlikes', SuperLikeController.store)
routes.post('/dashboard/:devId/dislikes', DislikesController.store)

routes.get('/match', LikeController.match)
routes.delete('/dashboard/:devId/match', LikeController.delete)


module.exports = routes