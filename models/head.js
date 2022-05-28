var mongoose = require('mongoose');

var schema = mongoose.Schema;

var headSchema = new schema({
    name: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Head', headSchema);