var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authKey = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    authKey: String
});

module.exports = mongoose.model('AuthKey', authKey);
