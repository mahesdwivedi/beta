var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username : { type: String, default: 'username' },
    name : { type: String, default: 'name' },
    fitbitId : { type: String, default: 'id' },
});
var user = mongoose.model('user', userSchema);
module.exports= user;
