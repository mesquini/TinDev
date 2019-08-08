const express = require('express')
const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const DislikesController = require('./controllers/DeslikeController')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json( {message : 'ola word'})
})

routes.get('/devs', DevController.index)
routes.post('/devs', DevController.store)
routes.post('/devs/:devId/likes', LikeController.store)
routes.post('/devs/:devId/dislikes', DislikesController.store)


module.exports = routes