var mongoose = require('mongoose');

var transaction = mongoose.Schema({
    data:{
        type:[]
    },
    timestamp:{
        type:Number
    }
});

module.exports = mongoose.model("associationlistdata", transaction, "associationlistdata");
