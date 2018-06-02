var mongoose = require('mongoose');
var userSchema = mongoose.Schema;

var userSchema = new Schema({
    image:{data:Buffer, contentType:String}

});

module.exports = userSchema;