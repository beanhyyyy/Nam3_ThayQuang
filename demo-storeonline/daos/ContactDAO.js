var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://kanghy:0979320779Qwe@cluster0-9lfpr.mongodb.net/dbFinal";
var ContactDAO = {
    insert: function (contact) {
      return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("dbFinal");
          dbo.collection("contact").insertOne(contact, function (err, res) {
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
          dbo.collection("contact").find(query).toArray(function (err, res) {
            if (err) return reject(err);
            resolve(res);
            db.close();
          });
        });
      });
    },
    getDetails: function(id) {
      return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("dbFinal");
          var ObjectId = require('mongodb').ObjectId;
          var query = { _id: ObjectId(id) };
          dbo.collection("contact").findOne(query, function (err, res) {
            if (err) return reject(err);
            resolve(res);
            db.close();
          });
        });
      });
    }
  };
module.exports = ContactDAO;