const { Schema, model } = require('mongoose')

const MatchSchema = new Schema({    
    loggerId: {
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    },
    targetId: {
        type : Schema.Types.ObjectId,
        ref : 'Dev',
    },
    visualizado : Boolean,    
}, {
        timestamps : true,    
})

module.exports = model('Match', MatchSchema)