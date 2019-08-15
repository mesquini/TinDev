import axios from 'axios'

const api = axios.create({
    baseURL : 'http://tinderdev-backend.herokuapp.com'
})

export default api;