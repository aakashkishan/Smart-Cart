// Include Modules
var express = require('express');
var uuid = require('node-uuid');
var fs = require('fs');
var router = express.Router();

// Stock Items related variables
var items = require('../data/items.json');
var imageURL, description, purchased = 0, item_id;

// Users related variables
var users = require('../data/users.json');
var user_name, password, profile_pic, first_name, last_name;
var enetered_username, entered_password, credentials;

// Purchase related global variables
var purchase = require('../data/purchase');
var purchase_quantity;
var number, item, item_name, item_price, price; 
    

// Later used for the Individual Stock Item Edit
var id;

console.log(items);

// GET Home Page for Login
router.get('/', function(req, res) {

  // Write the updated items JSON Object into the file
  fs.writeFile('../data/items.json', JSON.stringify(items), function(error) {
    if(error) {
      console.log(error);
    }
  });

  // Default Profile Picture
  profile_pic = "https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png";

  res.render('home/login', {
    title: 'Smart-Cart',
    profile_pic: profile_pic
  })
});

// Handle POST from the Login Page
router.post('/login', function(req, res) {

  var flag = 0;

  entered_username = req.body.username;
  entered_password = req.body.password;

  for(var i = 0; i < users.length; i++) {
    if(entered_username == users[i].username && entered_password == users[i].password) {
      flag = 1;
    }
  }

  if(flag == 1) {
    res.render('home/index', {
      title: 'Smart-Cart',
      items: items
    });
  } else {
    res.render('home/login_err', {
      title: 'Smart-Cart',
      profile_pic: profile_pic
    });
  }

})

// GET Signup Page
router.get('/signup', function(req, res) {

  res.render('home/signup', {
    title: 'Smart-Cart',
    profile_pic: profile_pic
  });
});

// Handle POST from SignUp Page
router.post('/signup', function(req, res) {

  user_name = req.body.username;
  password = req.body.password;
  first_name = req.body.firstname;
  last_name = req.body.lastname;
  profile_pic = req.body.imageURL;

  var credentials = {
    "username": user_name,
    "password": password,
    "first_name": first_name,
    "last_name": last_name,
    "profile_picture": profile_pic 
  }

  users.push(credentials);

  res.render('home/login', {
    title: 'Smart-Cart',
    profile_pic: profile_pic
  });

});

// GET the Login Error Page
// router.get('/')


// GET Index Page for Diaplay of SuperMarket Items.
router.get('/index', function(req, res, next) {

  if(purchased == 1) {
    for(var i = 0; i < items.length; i++) {

      items[i].stock_quantity = items[i].stock_quantity - items[i].purchase_quantity;
      if(items[i].purchase_quantity != 0) {
        items[i].item_price = items[i].item_price / items[i].purchase_quantity;
      }
      items[i].purchase_quantity = 0;

      purchase = [];
    }
  }

  purchased = 0;

  res.render('home/index', { 
    title: 'Smart-Cart',
    items: items
  });
});


// GET Stock Page
router.get('/admin/stock', function(req, res) {
  res.render('home/stock', {
    title: "Smart-Cart",
    items: items
  });
});

// GET Purchase Bill Page
router.get('/admin/bill', function(req, res) {

  var time_stamp_id = uuid.v4();

  var total_items = 0,
      total_price = 0,
      final_price;
  
  for(var i = 0; i < purchase.length; i++) {
    total_items = total_items + purchase[i].quantity;
    total_price = total_price + purchase[i].item_price;
    purchased = 1;
  }

  // Considering the Tax is 5 percentage of the total price
  final_price = Math.abs( 5/100 * total_price ) + total_price;

  res.render('home/bill', {
    title: 'Smart-Cart',
    purchase: purchase,
    total_items: total_items,
    total_price: total_price,
    final_price: final_price
  });

  // Log the Purchase Data
  fs.writeFile('../bills/bill_' + time_stamp_id, JSON.stringify(purchase), function(error) {
    if(error) {
      console.log(error);
    }
  });

});

// GET Addition / Deletion of Stock Page
router.get('/admin/edit-stock', function(req, res) {

  res.render('home/edit', {
    title: 'Smart-Cart',
    items: items
  });
});

// Handle POST from that Stock Edit Page
router.post('/admin/edit-stock', function(req, res) {

  item_price = req.body.price;

  console.log(items);

  // To Add Stock onClick of Button
    var getItem = {

      // Generate a Time-Stamp based unique id with uuid.
      "id": uuid.v4(),
      "name": req.body.item_name,
      "description": req.body.description,
      "imageURL": req.body.img_url,
      "item_price": req.body.price,
      "purchase_quantity": 0,
      "stock_quantity": req.body.quantity,
      "expiry_date": req.body.exp_date,
      "purchased": 0,
      "quantity_type": req.body.qty_type
    }

    items.push(getItem);
    console.log(items);

    res.render('home/edit', {
    title: 'Smart-Cart',
    items: items
  });
});

// GET The Individual Item Purchase Page
router.get('/admin/purchase/:id', function(req, res) {
  item_id = req.params.id;
  
  // Check ID of the Item
  for(var i = 0; i < items.length; i++) {
    if(items[i].id == item_id) {

      // Assign Temporary variables for the particular item info
      item = items[i];
      item_name = item.name;
      imageURL = item.imageURL;
      description = item.description;
      price = item.item_price;
      quantity = item.purchase_quantity;


      res.render('home/purchase', {
        title: 'Smart-Cart',
        name: item_name,
        description: description,
        price: price,
        quantity: quantity,
        imageURL: imageURL
      });

    }
  }
});

// Handle POST from that Individual Item Purchase Page
router.post('/index', function(req, res) {

      var temp_price;

      // Get the purchase Quantity
      quantity = req.body.quantity;


      // Check If anything has been bought
      if(quantity != 0) {
        purchased = 0;
      }

      // Update the items array of the purchase if the ID are the same.
      for (var i = 0; i < items.length; i++) {
        if(items[i].id == item_id) {
          items[i].purchase_quantity = quantity;
          items[i].item_price = items[i].item_price * items[i].purchase_quantity;
          items[i].purchased = purchased;

          // PurchaseData Structure and Initialization defined
          var purchaseData = {
            "id": items[i].id,
            "item_name": items[i].name,
            "imageURL": items[i].imageURL,
            "quantity": items[i].purchase_quantity,
            "expiry_date": items[i].expiry_date,
            "item_price": items[i].item_price,
            "purchased": items[i].purchased,
            "quantity_type": items[i].quantity_type
          }

          purchase.push(purchaseData);
          console.log(purchase);
        }
      }

      res.render('home/index', {
        title: 'Smart-Cart',
        items: items
      });

});


// GET The Edition of existing Stock Individual Item Page
router.get('/admin/edit/:id', function(req, res) {
  id = req.params.id;
  var stock_item;
  var desc, price, image_url, quantity, item_name, exp_date, qty_type, pur_qty;

  // Find the Item in the Stock with the same ID
  for(var i = 0; i < items.length; i++) {
    if(id == items[i].id) {
      stock_item = items[i];
    }
  }

  item_name = stock_item.name;
  quantity = stock_item.stock_quantity;
  price = stock_item.item_price;
  image_url = stock_item.imageURL;
  desc = stock_item.description;
  exp_date = stock_item.expiry_date;
  qty_type = stock_item.quantity_type;
  pur_qty = stock_item.purchase_quantity;
  
  res.render('home/update', {
    title: 'Smart-Cart',
    name: item_name,
    description: desc,
    expiry_date: exp_date,
    price: price,
    stock_quantity: quantity,
    imageURL: image_url,
    quantity_type: qty_type,
    purchase_quantity: pur_qty
  })

});

// Handle POST from the Individual Stock Item Page
router.post('/admin/stock', function(req, res) {
 
  for(var i = 0; i < items.length; i++) {
    if(id == items[i].id) {
      items[i].name = req.body.name;
      items[i].stock_quantity = req.body.stock_quantity;
      items[i].item_price = req.body.item_price;
      items[i].expiry_date = req.body.expiry_date;
      items[i].imageURL = req.body.imageURL;
    }
  }

  res.render('home/stock', {
    title: 'Smart-Cart',
    items: items
  })

})

module.exports = router;
