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


var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "s_closet"
});

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
var deviceID = 1

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

async function Check_pkt_type(RFID){
   sql = "SELECT * FROM cloths WHERE RFID = ?"
   con.query(sql,[RFID],function(err,result){
      if (err) {throw err}
      if(result.length>0){
         sql = "SELECT * FROM inventory WHERE RFID = ?"
         con.query(sql,RFID,function(err,result){
            if(result.length>0){
               if (err) {throw err}
               sql = "DELETE FROM inventory WHERE RFID = ?"
               con.query(sql, [RFID], function(err,result){
                  if(err) {throw err}
                  return(2);
               })
            }
            return(1);
         })
      }
      return(0);
   })
}

app.post('/signup', function(req,res){
   /*if (!validate_session(req)) {
      res.status(200).send("Invalid Session");
      return;
   }*/
   console.log('signup')

   var body = req.body;
   var uID = parseInt(Math.random()*10000000)
   var username = body['username'];
   var firstname = body['firstname'];
   var lastname = body['lastname'];
   var pin = "123456";
   var age = body['age'];
   var gender = body['gender'];
   var city = body['city'];
   var data = [uID, username, firstname, lastname, pin, gender, age, city];

   sql = "SELECT * FROM user_profile WHERE username = ?"
   con.query(sql, username, function(err,result){
      if (err) throw err;
      if(result.length > 0){
         res.status(403).send("User already exist");
      }
      else{
         sql = "INSERT INTO `user_profile` VALUES (?,?,?,?,?,?,?,?)";
         con.query(sql, data, function (err, result) {
            console.log(err);

            if (err) throw err;
            res.status(200).send("A new user linked with this device");
         });
      }
   });
})


app.post('/login', function (req,res){  
   /*if (validate_session(req)) {
      res.status(200).send('Session is already running for this device');
      return;
   }*/
   
   var username = req.body['username'];
   var pin = req.body['pin'];
   var sql = "SELECT * FROM user_profile WHERE username = ?"
   con.query(sql, username, function (err, result) {
      if (err) throw err;
      if(result.length != 0){
         if(result[0]['pin'] == pin){
            var sessionToken = uuid.v4()
            var now = new Date()
            var expiresAt = new Date(+now + 120 * 1000)
            var uID = result[0]['uID']
            const session = new Session(uID, expiresAt)
            sessions[sessionToken] = session
            res.cookie("session_token", sessionToken, { expires: expiresAt });
            res.status(200).send("Authorized");
         }
         else
            res.status(403).send("Wrong pin");
      }
   })  
})

app.post('/add_new_cloth', function(req,res){
   /*if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return
   }*/


   var RFID = req.body['RFID'];
   var uID = req.body['uID'];
   var cType = req.body['cType'];

   sql = "INSERT INTO cloths VALUES (?,?,?)"
   con.query(sql,[RFID,uID,cType],function(err,result){
      if (err) {throw err}
   })

   sql = "INSERT INTO inventory VALUES (?,?,?)"
   con.query(sql,[RFID,uID,"0"],function(err,result){
      if (err) {throw err}
   })

   res.status(200).send("Collect and stick RFID on cloth");
   //Print RFID tag
})

app.post('/cloth_scanned',async function(req,res){
   /*if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return
   }*/
   var RFID = req.body['RFID'];
   var pkt_type = await Check_pkt_type(RFID);
   io.to(socket_devices[deviceID]).emit('RFID scanned',['Cloth Scanned', pkt_type, RFID]) //0: new cloth, 1: put cloth, 2: take cloth
   res.status(200).send("RFID read");
   
})

app.post('/add_cloths',function(req,res){
   /*if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return 
   }*/

   var data = [];
   var body = req.body;

   for(var i=0;i<body['RFID'].length;i++){
      data.push([body['RFID'][i],body['uID'][i],body['laundryState'][i]])
   }

   sql = "INSERT INTO inventory VALUES ?"
   con.query(sql,[data],function(err,result){
      if(err) {throw err}
   })
   res.status(200).send("Cloths added into inventory");
})

app.post('/display_users', function(req, res){
   /*if(!validate_session(req)){
      res.status(401).send('Invalid Session')
      return;
   }*/

   var sql = "SELECT uID,username FROM user_profile"
   con.query(sql,function(err,result){
      if(err) throw err;
      res.status(200).send(result);
   })
})

io.on('connection', function(socket){
   
   socket_devices[deviceID] = socket.id;
   io.on('connected',function(deviceID){
      console.log("Device connected, ID:" + deviceID)
      socket_devices[deviceID] = socket.id;
   })
});

var server = http.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("server online")
   console.log(server.address());
})