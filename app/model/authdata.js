var mongoose = require('mongoose');

var transaction = mongoose.Schema({
    auth:{
        type:[]
    },
    timestamp:{
        type:Number
    }
});

module.exports = mongoose.model("auth", transaction, "auth");
