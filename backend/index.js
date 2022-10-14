var machine = require('node-machine-id');
var express = require('express');
var app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "S_Closet",
  password: "Team4@closet",
  database: "s_closet"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", function(req,res){
   res.send('Hello World');

   machine.machineId().then((id) => {
      var sql = "SELECT * FROM device WHERE device_id = 'id.toString()'";
      con.query(sql, function (err, result) {
       if (err) throw err;
       if(result.length == 0){
         console.log("New device");
         }
     });
   })
})

app.post('/', function (req, res) {
   //Return Home.html file
   res.send('Hello World');
})

app.post('/verifyPassword', function (req,res){
   var uname = req.get('Uname').toString();
   var pass = req.get('Password').toString();

})

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port

})