var mongoose = require('mongoose');

var schema = mongoose.Schema;

var adminSchema = new schema({
    name: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Admin', adminSchema);