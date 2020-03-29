var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://kanghy:0979320779Qwe@cluster0-9lfpr.mongodb.net/dbFinal";
var CustomerDAO = {
  insert: function (customer) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbFinal");
        dbo.collection("customer").insertOne(customer, function (err, res) {
          if (err) return reject(err);
          resolve(res.insertedCount > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  getAll: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbFinal");
        var query = {};
        dbo.collection("customer").find(query).toArray(function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  get: function(username, password) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbFinal");
        var query = { username: username, password: password };
        dbo.collection("customer").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = CustomerDAO;