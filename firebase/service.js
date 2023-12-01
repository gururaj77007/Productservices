var admin = require("firebase-admin");
var serviceaccount = require("./gb-77-8a9cc-firebase-adminsdk-t1hfq-4997b7339f.json");

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
  storageBucket: "gs://gb-77-8a9cc.appspot.com",
}); // Export the function
