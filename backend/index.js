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


var con = mysql.createConnection({
 host: "localhost",
 user: "S_Closet",
 password: "Team4@closet",
 database: "s_closet"
});

con.connect(function(err) {
 if (err) throw err;
 console.log("Database connected!");
});

// for 
app.use(cookieParser());

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
var socket_user= []

app.post("/", function(req,res){
   res.status(400).send('Not available');
})

app.post('/signup', function(req,res){
   if (req.cookies) {
      var sessionT = req.cookies['session_token']
      if(sessions[sessionT]){
         if(!sessions[sessionT].isExpired()){
            res.redirect(307,'/closet');
            return;
         }
      }
   }

   var body = req.body;
   var uID = parseInt(Math.random()*10000000)
   var username = body['username'];
   var firstname = body['firstname'];
   var lastname = body['lastname'];
   var pin = body['pin'];
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
            if (err) throw err;
            res.status(200).send("A new user linked with this device");
         });
      }
   });
})


app.post('/login', function (req,res){  
   if (req.cookies) {
      var sessionT = req.cookies['session_token']
      if(sessions[sessionT]){
         if(!sessions[sessionT].isExpired()){
            res.redirect(307,'/closet');
            return;
         }
      }
   }
   
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

app.post('/closet', function(req,res){
   if (!req.cookies) {
       res.status(401).send('Invalid Session')
      return
   }

    // We can obtain the session token from the requests cookies, which come with every request
    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        // If the cookie is not set, return an unauthorized status
        res.status(401).send('Invalid Session')
        return
     }

    // We then get the session of the user from our session map
    // that we set in the signinHandler
    userSession = sessions[sessionToken]
    if (!userSession) {
        // If the session token is not present in session map, return an unauthorized error
        res.status(401).send('Invalid Session')
        return
     }
    // if the session has expired, return an unauthorized error, and delete the 
    // session from our map
    if (userSession.isExpired()) {
       delete sessions[sessionToken]
       res.status(401).end('Session expired')
       return
    }

    res.status(200).send('Closet')
})

/*io.set("authorization", function(data, accept) {
   console.log(data.headers.cookies);
});
*/
io.on('connection', function(socket){
   console.log('A user connected');
   socket.on('setUsername', function(data){
      if(users.indexOf(data) > -1){
         users.push(data);
         socket.emit('userSet', {username: data});
      } else {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
     }
   })
});

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("server online")
   console.log(server.address());
})

