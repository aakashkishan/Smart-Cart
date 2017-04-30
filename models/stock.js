// Include required modules
var mongoose = require('mongoose');

// The Blueprint for the Item Set is defined
var Schema = new mongoose.Schema({
    imageURL: {type: String, required: true, default: 'http://www.kalahandi.info/wp-content/uploads/2016/05/sorry-image-not-available.png'},
    name: {type: String, required: true},
    description: {type: String, required: false},
    item_price: {type: Number, required: true}, 
    expiry_date: {type: String, required: false},
    stock_quantity: {type: Number, required: false},
    purchase_quantity: {type: Number, required: false},
    quantity_type: {type: String, required: false},
});

// The Model of the Item is ready to be exported
module.exports() = mongoose.model('Item', Schema);