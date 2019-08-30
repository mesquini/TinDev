const { Schema, model } = require('mongoose')

const DevSchema = new Schema({
    name: String,
    user: String,    
    bio : String,
    avatar : String,
    company : String,
    blog : String,
    email : String,
    url_github : String,
    celular : {
        type: String,
        default: null,
    },
    super_like : {
        type: Boolean,
        default: true,
    },
    superlikes: [{
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    }],
    likes: [{
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    }],
    dislikes: [{
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    }],
}, {
        timestamps : true,    
})

module.exports = model('Dev', DevSchema)