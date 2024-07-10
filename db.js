const db = require('mongoose');
db.connect('mongodb://127.0.0.1/testdb')  // it returns a promise.
    .then(() => { console.log('connection is succesfull') })
    .catch(() => { console.error('connection error') })
console.log("connected")

let data = db.Schema({
    username:{type:String , required:true},
    password:{type:String , required:true}
})

module.exports = db.model('newuser',data);