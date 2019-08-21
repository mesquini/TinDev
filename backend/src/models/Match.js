const { Schema, model } = require('mongoose')

const MatchSchema = new Schema({    
    match: [{
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    }],
    visualizado : {
        type : Number,
        default : 0,
    }    
}, {
        timestamps : true,    
})

module.exports = model('Match', MatchSchema)