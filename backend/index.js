var machine = require('node-machine-id');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var uuid = require('uuid');
var upload = multer();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require("cors");
const dotenv = require('dotenv');
const util = require('util');

// Initialize environment config
dotenv.config();


var con = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASS,
 database: process.env.DB_DATABASE,
});

class Scanned_Cloth {
   constructor(msg, pkt_Type, RFID, deviceID){
      this.pkt_Type = pkt_Type
      this.msg = msg
      this.RFID = RFID
      this.deviceID = deviceID
   }
}

con.connect(function(err) {
 if (err) throw err;
 console.log("Database connected!");
});

// for parsing cookies
app.use(cookieParser());

const corsOptions = {
   origin: true,
   methods: ['GET', 'POST', 'DELETE'],
   credentials: true,
 };
 app.use(cors(corsOptions));
 app.options('*', cors());
 
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

class Session {
   constructor(uID, expiresAt) {
      this.uID = uID
      this.expiresAt = expiresAt
   }

   // we'll use this method later to determine if the session has expired
   isExpired() {
      return this.expiresAt < (new Date())
   }
}

var sessions = {}
var socket_devices= []

function validate_session(req){
   if (!req.cookies) {
      //res.status(401).send('Invalid Session')
      return false
   }

    // We can obtain the session token from the requests cookies, which come with every request
    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        // If the cookie is not set, return an unauthorized status
        return false
     }

    // We then get the session of the user from our session map
    userSession = sessions[sessionToken]
    if (!userSession) {
        // If the session token is not present in session map, return an unauthorized error
        return false
     }
    // if the session has expired, return an unauthorized error, and delete the 
    // session from our map
    if (userSession.isExpired()) {
       delete sessions[sessionToken]
       return false
    }

    return true
}



app.post('/register_device', function(req, res){
   var deviceID = req.body['deviceID'];
   var devicename = req.body['devicename'];
   var pin = req.body['pin'];
   var data = [deviceID, devicename, pin]
   var sql = "SELECT * from super_user WHERE deviceID = ?"
   con.query(sql, deviceID, function(err, result){
      if(err) throw err;
      if(result.length>0)
         res.status(403).send("This device is already linked with system");
   });
   var sql = "INSERT INTO super_user VALUES (?,?,?)"
   con.query(sql, data, function(err, result){
      if(err) throw err;
      res.status(200).send("A new device linked with system");
   })
})

app.post('/login', function (req,res){  
   if (validate_session(req)) {
      res.status(200).send('Session is already running for this device');
      return;
   }
   
   var deviceID = req.body['deviceID'];
   var pin = req.body['pin'];
   var sql = "SELECT * FROM super_user WHERE deviceID = ?"
   con.query(sql, deviceID, function (err, result) {
      if (err) throw err;
      if(result.length != 0){
         if(result[0]['pin'] == pin){
            var sessionToken = uuid.v4()
            var now = new Date()
            var expiresAt = new Date(+now + 1200 * 1000)
            var uID = result[0]['uID']
            const session = new Session(uID, expiresAt)
            sessions[sessionToken] = session
            res.cookie("session_token", sessionToken, { expires: expiresAt });
            res.status(200).send("Authorized");
         }
         else
            res.status(403).send("Wrong pin");
      }
      else
         res.status(403).send("No such device is registered with system")
   })  
})


app.post('/register_user', function(req,res){
   if (!validate_session(req)) {
      res.status(200).send("Invalid Session");
      return;
   }

   var body = req.body;
   var deviceID = body['deviceID'];
   var username = body['username'];
   var firstname = body['firstname'];
   var lastname = body['lastname'];
   var age = body['age'];
   var gender = body['gender'];
   var city = body['city'];
   var data = [null, deviceID, username, firstname, lastname, gender, age, city];

   sql = "SELECT * FROM user_profile WHERE username = ?"
   con.query(sql, username, function(err,result){
      if (err) throw err;
      if(result.length > 0){
         res.status(403).send("User already exist");
      }
      else{
         sql = "INSERT INTO `user_profile` VALUES (?,?,?,?,?,?,?,?)";
         con.query(sql, data, function (err, result) {
            if (err) throw err;
            res.status(200).send("A new user linked with this device");
         });
      }
   });
})

app.post('/delete_user',function(req,res){
   if (!validate_session(req)) {
      res.status(200).send("Invalid Session");
      return;
   }

   var uID = req.body['uID'];
   var sql = "SELECT * from user_profile WHERE uID = ?"
   con.query(sql, uID, function (err, result) {
      if (err) throw err
      if(result.length != 0){
         var sql = "DELETE from user_profile WHERE uID = ?"
         con.query(sql, uID, function(err, result){
            if (err) throw err
         })

         sql = "DELETE from inventory WHERE uID = ?"
         con.query(sql, uID, function(err, result){
            if (err) throw err
         })
         res.status(200).send("User deleted");
      }
      else{
         res.status(403).send("User not exist");
      }
   })
   
})

//app.post('/')


app.post('/cloth_scanned',async function(req,res){
   if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return
   }

   const query = util.promisify(con.query).bind(con);
   var RFID = req.body['RFID'];
   var deviceID = req.body['deviceID'];
   var pkt_type,result,result1,result2;
   sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
   try{
      result = await query(sql,[RFID,deviceID])
   }finally{}
   if(result.length>0){
      if(result[0]['availableInCloset']==1){
         sql = "UPDATE inventory SET availableInCloset = 0 WHERE RFID = ? AND deviceID = ?"
         result2 = await query(sql, [RFID, deviceID])
         c1 = new Scanned_Cloth("take_cloth", 2, RFID, deviceID);
         io.to(socket_devices[deviceID]).emit('RFID scanned',c1) //0: new cloth, 1: put cloth, 2: take cloth
      }
      else{
         var counter = result[0]['usedBeforeWash'] + 1;
         sql = "UPDATE inventory SET availableInCloset = 1, usedBeforeWash = ? WHERE RFID = ? AND deviceID = ?"
         await query(sql, [counter, RFID, deviceID])
         c1 = new Scanned_Cloth("put_cloth", 1, RFID, deviceID);
         io.to(socket_devices[deviceID]).emit('RFID scanned',c1) //0: new cloth, 1: put cloth, 2: take cloth
      }
   }
   else{
      c1 = new Scanned_Cloth("new_Cloth", 0, RFID, deviceID);
      io.to(socket_devices[deviceID]).emit('RFID scanned',c1) //0: new cloth, 1: put cloth, 2: take cloth
   }
   res.status(200).send("RFID read");
})

app.post('/add_new_cloth', function(req,res){
   if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return
   }

   var RFID = req.body['RFID'];
   var uID = req.body['uID'];
   var cType = req.body['cType'];
   var deviceID = req.body['deviceID']

   sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
   con.query(sql,[RFID, deviceID],function(err,result){
      if (err) {throw err}
      if(result.length> 0){
         res.status(403).send("RFID is already used with this device")
      }  
      else{
         var sql = "SELECT * FROM user_profile WHERE uID = ? AND deviceID = ?"
         con.query(sql, [uID,deviceID], function(err, result){
            if (err) throw err;
            if(result.length != 0){
               sql = "INSERT INTO inventory VALUES (?,?,?,?,?,?)"
               con.query(sql,[RFID, deviceID, uID, cType, 0, 1],function(err,result){
                  if (err) {throw err}
               })
               res.status(200).send("Scan and stick RFID on cloth");      
            }else{
               res.status(403).send("Invalid user");
            }
         })         
      }
   })
})

app.post('/add_cloths',async function(req,res){
   if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return 
   }

   var data = [];
   var body = req.body;
   const query = util.promisify(con.query).bind(con);
   if(Array.isArray(body['RFID'])){
      for(var i=0;i<body['RFID'].length;i++){
         if(body['laundryState'][i] == 1){
            var result;
            var sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
            try{
               result = await query(sql, [body['RFID'][i], body['deviceID'][i]])
            }finally{}
            if(result.length>0){
               data.push([body['RFID'][i],body['deviceID'][i]]);
            }
         }
      }
   }
   else{
      if(body['laundryState'] == 1){
         var result;
         var sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
         try{
            result = await query(sql, [body['RFID'], body['deviceID']])
         }finally{}
         if(result.length>0){
            data.push([body['RFID'], body['deviceID']]);
         }
      }
   }
   for(i = 0; i < data.length; i++){
      sql = "UPDATE inventory SET usedBeforeWash = 0 WHERE RFID = ? AND deviceID = ?"
      con.query(sql,data[i],function(err,result){
         if(err) {throw err}
      })
   }
   res.status(200).send("Cloths added into inventory");
})

app.post('/display_users', function(req, res){
   if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return;
   }
   var deviceID = req.body['deviceID'];
   var sql = "SELECT uID,username FROM user_profile WHERE deviceID = ?"
   con.query(sql, deviceID, function(err,result){
      if(err) throw err;
      res.status(200).send(result);
   })
})

app.post('/dashboard', function(req,res){
   /*if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return;
   }*/
   var deviceID = req.body['deviceID'];
   var sql = "SELECT * FROM user_profile WHERE deviceID = ?"
   const query = util.promisify(con.query).bind(con);
   query(sql, deviceID,async function (err, result) {
      if (err) {throw err}
         for(i = 0;i < result.length;i++){
            var username = result[i]['username']
            var uID = result[i]['uID']
            var sql1 = "SELECT * from inventory WHERE uID = ?";
            
            const query = util.promisify(con.query).bind(con);
            try {
               var result1 = await query(sql1,uID);
               console.log("User: " + username + " has "+ result1.length + " washed cloths in his closet");
            } finally {
               
            }
         }
      
      res.status(200).send("Dashboard");
   })
   
})

io.on('connection', function(socket){
   socket.on('connected',function(deviceID1){
      deviceID = deviceID1;
      socket_devices[deviceID] = socket.id;
   })
});

let appPort = process.env.PORT || 8000;
var server = http.listen(appPort, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("server online")
   console.log(server.address());
})

//dashboard
/*Inventory
washed
unwashed
formal
casual*/