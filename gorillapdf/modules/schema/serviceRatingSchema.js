const mongoose = require('mongoose');
var serviceRatingSchema = new mongoose.Schema({
    _id: Number,
    service_name: String,
    rating_count: Number,
    rating_total: Number
}, { collection: 'ServiceRating' });

var ServiceRating = mongoose.model('ServiceRating', serviceRatingSchema);

module.exports = ServiceRating;