const express = require('express')
const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const DislikesController = require('./controllers/DeslikeController')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json( {message : 'ola world'})
})

routes.get('/logge_dev', DevController.loggeDev)
routes.get('/dashboard', DevController.index)
routes.post('/dashboard', DevController.store)
routes.delete('/dashboard/:devId', DevController.delete)
routes.put('/dashboard/:devId/perfil', DevController.update)

routes.post('/dashboard/:devId/likes', LikeController.store)
routes.get('/dashboard/:devId/match', LikeController.match)
routes.post('/dashboard/:devId/dislikes', DislikesController.store)


module.exports = routes