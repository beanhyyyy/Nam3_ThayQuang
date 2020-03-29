var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var ProductDAO = require('../daos/ProductDAO.js');
var CustomerDAO = require('../daos/CustomerDAO.js');
var AdminDAO = require('../daos/AdminDAO.js');
var OrderDAO = require('../daos/OrderDAO.js');
var ContactDAO = require('../daos/ContactDAO.js');
// routes
router.get('/', function (req, res) {
  res.redirect('/admin/login');
});

router.get('/login', function (req, res) {
  res.render('admin/login.ejs');
});

router.post('/login', async function (req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var admin = await AdminDAO.get(username, password);
  var customer = await CustomerDAO.get(username, password);
  if (admin) {
    req.session.admin = admin;
    res.redirect('/admin/home');
  } else if (customer) {
    req.session.customer = customer;
    res.redirect('/admin/homeCustomer');
  } else {
    res.redirect('/admin/login');
  }

});

router.get('/home', function (req, res) {
  if (req.session.admin) {
    res.render('admin/home.ejs');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/homeCustomer', function (req, res) {
  if (req.session.customer) {
    res.render('admin/homeCustomer.ejs');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/addproduct', function (req, res) {
  res.render('admin/addproduct.ejs');
});

router.post('/addproduct', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtProperty_Name;
  var description = req.body.txtDescription;
  var address = req.body.txtAddress;
  var price = parseInt(req.body.txtPrice);
  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var product = { name: name, description: description, address: address, price: price, image: image };
    var result = await ProductDAO.insert(product);
    if (result) {
      res.send('OK BABY!');
    } else {
      res.send('SORRY BABY!');
    }
  }
});

router.get('/addcontact', function (req, res) {
  res.render('admin/addcontact.ejs');
});

router.post('/addcontact', async function (req, res) {
  var name = req.body.txtCustNameOfContact;
  var phone = req.body.txtCustPhoneOfContact;
  var description = req.body.txtCustDescriptionOfContact;
  var now = new Date().getTime(); // milliseconds
  var contact = { name: name, phone: phone, datetime: now, description: description };
  var result = await ContactDAO.insert(contact);
  if (result) {
    res.send('OK BABY!');
  } else {
    res.send('SORRY BABY!');
  }
});

router.get('/viewcontact', async function (req, res) {
  var contacts = await ContactDAO.getAll();
  res.render('admin/viewcontact.ejs', { contacts: contacts });
});


/////////////
router.get('/addcustomer', function (req, res) {
  res.render('admin/addcustomer.ejs');
});

router.post('/addcustomer', async function (req, res) {
  var username = req.body.txtUsernameOfCustomer;
  var password = req.body.txtPasswordOfCustomer;
  var now = new Date().getTime(); // milliseconds
  var customer = { username: username, password: password, datetime: now };
  var result = await CustomerDAO.insert(customer);
  if (result) {
    res.send('OK BABY!');
  } else {
    res.send('SORRY BABY!');
  }
});

router.get('/viewcustomer', async function (req, res) {
  var customers = await CustomerDAO.getAll();
  res.render('admin/viewcustomer.ejs', { customers: customers });
});


//////////////
router.get('/listorders', async function (req, res) {
  var orders = await OrderDAO.getAll();
  var id = req.query.id; // /listorders?id=XXX
  var order = await OrderDAO.getDetails(id);
  res.render('admin/listorders.ejs', { orders: orders, order: order });
});

router.get('/updatestatus', async function (req, res) {
  var id = req.query.id;
  var status = req.query.status;
  var result = await OrderDAO.update(id, status);
  res.redirect('/admin/listorders');
});

module.exports = router;