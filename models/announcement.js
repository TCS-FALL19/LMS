var mongoose = require('mongoose');

var schema = mongoose.Schema;

var announcementSchema = new schema({
    text: {
        // The text of the announcement
        type: String,
        required: true,
    },
    links: [{
        // Any hyperlinks
        type: String
    }],
    },{
        timestamps: true
    });
module.exports = mongoose.model('Announcement', announcementSchema);