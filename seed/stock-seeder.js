// Include Modules
// var Item = require('../models/stock');
var mongoose = require('mongoose');

//Flag is required for the execution of the mongoose disconnect method.
var flag = 0;

// MongoDB Credentials
var username = "admin";
var password = "password";
var databaseName = "smart-cart";
var databaseURI = "mongodb://" + username + ":" + password + "@ds119081.mlab.com:19081/" + databaseName;
mongoose.Promise = global.Promise;

//Since this code is that of a seeder, we'll have to connect and disconnect to the MongoDB server.
var connection = mongoose.createConnection(databaseURI);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.on('open', function() {

    console.log("stock seeder");

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

    // Initialize the Items array
    var products = [
        new Item({
            imageURL: 'https://sc02.alicdn.com/kf/UT8W_44XN4XXXagOFbXA/Fresh-watermelons.jpg',
            name: 'Water Melon',
            description: 'It is an Organically grown creeper. It is extremely juicy and is suitable to quench thirst in Summer.',
            item_price: 8,
        }),
        new Item({
            imageURL: 'https://4.imimg.com/data4/MP/SS/MY-12767951/fresh-grapes-250x250.jpg',
            name: 'Green Grapes',
            description: 'It is an Organically grown climber. It is extremely juicy and it is consumed in small doses.',
            item_price: 10,
        }),
    ];

    console.log("Hello");

    for (var j = 0; j < products.length; j++) {
        products[j].save( (error, result) => {
            if(error) {
                console.log(error);
            } else {
                flag++;
            }
        });

        if(flag === products.length) {
            mongoose.disconnect();
        }
    }

})