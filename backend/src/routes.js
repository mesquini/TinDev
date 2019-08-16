const express = require('express')
const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const DislikesController = require('./controllers/DeslikeController')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json( {message : 'ola world'})
})

routes.get('/dashboard', DevController.index)

routes.delete('/dashboard/:devId', DevController.delete)

routes.post('/dashboard', DevController.store)
routes.post('/dashboard/:devId/likes', LikeController.store)
routes.post('/dashboard/:devId/dislikes', DislikesController.store)


module.exports = routes