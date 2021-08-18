var mongoose = require('mongoose');

var transaction = mongoose.Schema({
    rs_token:{
        type:String
    },
    timestamp:{
        type:Number
    }
});

module.exports = mongoose.model("auth", transaction, "auth");
