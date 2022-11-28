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
const axios = require('axios');
var accuweather = require('node-accuweather')()('jgS2xPHZDJfQ9rz4fE6skA8xJdq8qSOR');
const request = require('request');
dotenv.config();
const { google } = require('googleapis');
const calendar = google.calendar('v3');
const oAuthClient = new google.auth.OAuth2('882011300173-fnt3kjgm3o32j0ukj76bqq1lcs4amueo.apps.googleusercontent.com', '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')

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

class Scanned_Cloth {
    constructor(msg, pkt_Type, RFID, deviceID) {
        this.pkt_Type = pkt_Type
        this.msg = msg
        this.RFID = RFID
        this.deviceID = deviceID
    }
}

con.connect(function (err) {
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

class weather {

    constructor(API_KEY, city, lat = null, long = null) {
        this.API_KEY = API_KEY;
        this.city = city;
        this.lat = lat;
        this.long = long;
        this.locationKey = null;
        this.weatherDetail = null;
    }

    generateLocationKeyUrl() {
        if (this.lat != null && this.long != null) {
            this.url = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + this.API_KEY + "&q=" + this.lat + "%2C%20" + this.long;
        }
        else {
            this.url = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + this.API_KEY + "&q=" + this.city;
        }
    }

    getLocationKey() {
        this.generateLocationKeyUrl();
        return new Promise((resolve, reject) => {
            request({ url: this.url, json: true }, function (err, res, body) {
                err ? reject(`Forecast cannot be retrieved. ERROR: ${err}`) : null;
                res.statusCode !== 200 ? reject(`Forecast cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`) : null;
                resolve(body)
            })
        })
    }

    async fatchLocationKey() {
        var result = await this.getLocationKey();
        if (Array.isArray(result))
            this.locationKey = result[0]['Key'];
        else
            this.locationKey = result['Key'];
    }

    async getWeatherForecast() {
        if (this.locationKey == null)
            await this.fatchLocationKey()
        this.url = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + this.locationKey + "?apikey=" + this.API_KEY + "&details=true&metric=true"
        return new Promise((resolve, reject) => {

            request({ url: this.url, json: true }, function (err, res, body) {
                err ? reject(`Forecast cannot be retrieved. ERROR: ${err}`) : null;
                res.statusCode !== 200 ? reject(`Forecast cannot be retrieved. Response: ${res.statusCode} ${res.statusMessage}`) : null;

                var minTemp = body.DailyForecasts[0].Temperature.Minimum.Value;
                var maxTemp = body.DailyForecasts[0].Temperature.Maximum.Value;
                var feelsLikeMin = body.DailyForecasts[0].RealFeelTemperature.Minimum.Value;
                var feelsLikeMax = body.DailyForecasts[0].RealFeelTemperature.Maximum.Value;
                var DayPrecipitation = body.DailyForecasts[0].Day.HasPrecipitation;
                if (DayPrecipitation) {
                    var DayPrecipitationType = body.DailyForecasts[0].Day.PrecipitationType;
                    var DayPrecipitationIntensity = body.DailyForecasts[0].Day.PrecipitationIntensity
                } else {
                    var DayPrecipitationType = null;
                    var DayPrecipitationIntensity = null;
                }
                var NightPrecipitation = body.DailyForecasts[0].Night.HasPrecipitation;
                if (NightPrecipitation) {
                    var NightPrecipitationType = body.DailyForecasts[0].Night.PrecipitationType;
                    var NightPrecipitationIntensity = body.DailyForecasts[0].Night.PrecipitationIntensity
                } else {
                    var NightPrecipitationType = null;
                    var NightPrecipitationIntensity = null;
                }
                var AirQuality = body.DailyForecasts[0].AirAndPollen[0]['Value'];
                var WindSpeed = body.DailyForecasts[0].Day.Wind.Speed.Value
                var WindDirect = body.DailyForecasts[0].Day.Wind.Direction.English
                var data = { "Min. Temp.": minTemp, "Max. Temp.": maxTemp, "Min. feels like": feelsLikeMin, "Max. feels like": feelsLikeMax, "Day": { "Precipitation": DayPrecipitation, "Precipitation Type": DayPrecipitationType, "Precipitation Intensity": DayPrecipitationIntensity }, "Night": { "Precipitation": NightPrecipitation, "Precipitation Type": NightPrecipitationType, "Precipitation Intensity": NightPrecipitationIntensity }, "Air Quality Index": AirQuality, "Wind Speed": WindSpeed, "Wind Direction": WindDirect };
                this.weatherDetail = data;
                resolve(data)
            })
        })
    }
}

var sessions = {}
var socket_devices = []
var ClothesCat = ["Top Wear", "Bottom Wear", 'Innerwear & Sleepwear', 'Sports & Active wear']
var ClothesSubCat = [
    ['T-shirt', 'Casual shirt', 'Formal shirt', 'Sweaters', 'Jacket', 'Blazer & Coats', 'Suits', 'Skirts'],
    ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track pants & Joggers'],
    ['Briefs & Trunks', 'Boxers', 'Vests', 'Sleepwear & Loungewear', 'Thermals'],
    ['Active t-shirts', 'Trackpants', 'Swimwear']
]

function validate_session(req) {
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


app.post('/register_device', function (req, res) {
    var deviceID = req.body['deviceID'];
    var devicename = req.body['devicename'];
    var pin = req.body['pin'];

    var sql = "SELECT * from super_user WHERE deviceID = ?"
    con.query(sql, deviceID, function (err, result) {
        if (err) throw err;
        if (result.length > 0)
            res.status(403).send("This device is already linked with system");
    });
    if (!req.body['lat'] || !req.body['long']) {
        lat = null;
        long = null;
    }
    else {
        lat = req.body['lat']
        long = req.body['long']
    }
    var city = req.body['city']
    var data = [deviceID, devicename, pin, city, lat, long]
    var sql = "INSERT INTO super_user VALUES (?,?,?,?,?,?)"
    con.query(sql, data, function (err, result) {
        if (err) throw err;
        res.status(200).send("A new device linked with system");
    })
})

app.post('/login', function (req, res) {
    if (validate_session(req)) {
        res.status(200).send('Session is already running for this device');
        return;
    }

    var deviceID = req.body['deviceID'];
    var pin = req.body['pin'];
    var sql = "SELECT * FROM super_user WHERE deviceID = ?"
    con.query(sql, deviceID, function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
            if (result[0]['pin'] == pin) {
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


app.post('/register_user', function (req, res) {
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
    var data = [null, deviceID, username, firstname, lastname, gender, age];

    sql = "SELECT * FROM user_profile WHERE username = ?"
    con.query(sql, username, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.status(403).send("User already exist");
        }
        else {
            sql = "INSERT INTO `user_profile` VALUES (?,?,?,?,?,?,?)";
            con.query(sql, data, function (err, result) {
                if (err) throw err;
                res.status(200).send("A new user linked with this device");
            });
        }
    });
})

app.post('/delete_user', function (req, res) {
    if (!validate_session(req)) {
        res.status(200).send("Invalid Session");
        return;
    }

    var uID = req.body['uID'];
    var sql = "SELECT * from user_profile WHERE uID = ?"
    con.query(sql, uID, function (err, result) {
        if (err) throw err
        if (result.length != 0) {
            var sql = "DELETE from user_profile WHERE uID = ?"
            con.query(sql, uID, function (err, result) {
                if (err) throw err
            })

            sql = "DELETE from inventory WHERE uID = ?"
            con.query(sql, uID, function (err, result) {
                if (err) throw err
            })
            res.status(200).send("User deleted");
        }
        else {
            res.status(403).send("User not exist");
        }
    })

})

//app.post('/')


app.post('/cloth_scanned', async function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return
    }

    const query = util.promisify(con.query).bind(con);
    var RFID = req.body['RFID'];
    var deviceID = req.body['deviceID'];
    var pkt_type, result, result1, result2;
    sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
    try {
        result = await query(sql, [RFID, deviceID])
    } finally { }
    if (result.length > 0) {
        if (result[0]['availableInCloset'] == 1) {
            sql = "UPDATE inventory SET availableInCloset = 0 WHERE RFID = ? AND deviceID = ?"
            result2 = await query(sql, [RFID, deviceID])
            c1 = new Scanned_Cloth("take_cloth", 2, RFID, deviceID);
            io.to(socket_devices[deviceID]).emit('RFID scanned', c1) //0: new cloth, 1: put cloth, 2: take cloth
        }
        else {
            sql = "UPDATE inventory SET availableInCloset = 1, used = ? WHERE RFID = ? AND deviceID = ?"
            await query(sql, [1, RFID, deviceID])
            c1 = new Scanned_Cloth("put_cloth", 1, RFID, deviceID);
            io.to(socket_devices[deviceID]).emit('RFID scanned', c1) //0: new cloth, 1: put cloth, 2: take cloth
        }
    }
    else {
        c1 = new Scanned_Cloth("new_Cloth", 0, RFID, deviceID);
        io.to(socket_devices[deviceID]).emit('RFID scanned', c1) //0: new cloth, 1: put cloth, 2: take cloth
    }
    res.status(200).send("RFID read");
})

app.post('/add_new_cloth', function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return
    }

    var RFID = req.body['RFID'];
    var uID = req.body['uID'];
    var cType = req.body['cType'];
    var cSubType = req.body['cSubType']
    var deviceID = req.body['deviceID']

    sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
    con.query(sql, [RFID, deviceID], function (err, result) {
        if (err) { throw err }
        if (result.length > 0) {
            res.status(403).send("RFID is already used with this device")
        }
        else {
            var sql = "SELECT * FROM user_profile WHERE uID = ? AND deviceID = ?"
            con.query(sql, [uID, deviceID], function (err, result) {
                if (err) throw err;
                if (result.length != 0) {
                    sql = "INSERT INTO inventory VALUES (?,?,?,?,?,?,?)"
                    con.query(sql, [RFID, deviceID, uID, cType, cSubType, 0, 1], function (err, result) {
                        if (err) { throw err }
                    })
                    res.status(200).send("Scan and stick RFID on cloth");
                } else {
                    res.status(403).send("Invalid user");
                }
            })
        }
    })
})

app.post('/display_inventory', async function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return
    }

    var body = req.body;
    var uID = body['uID'];
    var deviceID = body['deviceID']
    var page = body['page']
    var numPerPage = body['entryPerPage'];
    const query = util.promisify(con.query).bind(con);
    var sql = "SELECT * FROM user_profile WHERE uID = ? AND deviceID = ?"
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + ',' + numPerPage;

    query('SELECT count(*) as RFID FROM inventory WHERE uID = ' + uID)
        .then(function (results) {
            numRows = results[0]['RFID'];
            numPages = Math.ceil(numRows / numPerPage);
        })
        .then(() => query('SELECT * FROM inventory WHERE uID = ' + uID + ' ORDER BY RFID LIMIT ' + limit))
        .then(function (results) {
            var responsePayload = {
                results: results
            };
            if (page < numPages) {
                responsePayload.pagination = {
                    current: page,
                    perPage: numPerPage,
                    previous: page > 0 ? page - 1 : undefined,
                    totalPages: numPages,
                    next: page < numPages - 1 ? parseInt(page) + 1 : undefined
                }
            }
            else responsePayload.pagination = {
                err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
            }
            res.json(responsePayload);
        })
        .catch(function (err) {
            console.error(err);
            res.json({ err: err });
        });
})

app.post('/add_cloths', async function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return
    }

    var data = [];
    var body = req.body;
    const query = util.promisify(con.query).bind(con);

    for (var i = 0; i < body.length; i++) {
        if (body[i]['laundryState'] == 1) {
            var result;
            var sql = "SELECT * FROM inventory WHERE RFID = ? AND deviceID = ?"
            try {
                result = await query(sql, [body[i]['RFID'], body[i]['deviceID']])
            } finally { }
            if (result.length > 0) {
                data.push([body[i]['RFID'], body[i]['deviceID']]);
            }
        }
    }

    for (i = 0; i < data.length; i++) {
        sql = "UPDATE inventory SET used = 0 WHERE RFID = ? AND deviceID = ?"
        con.query(sql, data[i], function (err, result) {
            if (err) { throw err }
        })
    }
    res.status(200).send("Cloths added into inventory");
})

app.post('/display_users', function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return;
    }
    var deviceID = req.body['deviceID'];
    var sql = "SELECT uID,username FROM user_profile WHERE deviceID = ?"
    con.query(sql, deviceID, function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
    })
})

app.post('/dashboard', async function (req, res) {
    /*if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return;
    }*/
    var response;
    var users = []
    var deviceID = req.body['deviceID'];
    var sql = "SELECT * FROM user_profile WHERE deviceID = ?"
    const query = util.promisify(con.query).bind(con);
    var result;
    try {
        result = await query(sql, deviceID);
    } catch { }
    for (i = 0; i < result.length; i++) {
        var username = result[i]['username']
        var uID = result[i]['uID']
        var sql1 = "SELECT * from inventory WHERE uID = ? AND used = 0 AND availableInCloset = 1";
        var sql2 = "SELECT * from inventory WHERE uID = ? AND used = 1 AND availableInCloset = 1";
        var sql3 = "SELECT * from inventory WHERE uID = ? AND used = 0 AND cType = 1 AND availableInCloset = 1"
        var sql4 = "SELECT * from inventory WHERE uID = ? AND used = 0 AND cType = 2 AND availableInCloset = 1"
        var sql5 = "SELECT * from inventory WHERE uID = ? AND used = 0 AND cType = 4 AND availableInCloset = 1"
        var sql6 = "SELECT * from inventory WHERE uID = ? AND used = 0 AND cType = 3 AND cSubType = 4 AND availableInCloset = 1"
        const query = util.promisify(con.query).bind(con);
        try {
            var result1 = await query(sql1, uID);
            var result2 = await query(sql2, uID);
            var result3 = await query(sql3, uID);
            var result4 = await query(sql4, uID);
            var result5 = await query(sql5, uID);
            var result6 = await query(sql6, uID);
            users[i] = { 'username': username, 'uID': uID, 'Washed cloths': result1.length, 'Unwashed cloths': result2.length, 'Top wear': result3.length, 'Bottom wear': result4.length, 'Sports wear': result5.length, 'Night wear': result6.length };

        } finally { }
    }
    try {
        result = await query(sql, deviceID)
    } finally { }
    var w = new weather('jgS2xPHZDJfQ9rz4fE6skA8xJdq8qSOR', 'Windsor', 42.314938, -83.036362);
    //var weatherDetails = await w.getWeatherForecast();
    const weatherDetails = {
        'Min. Temp.': 2.8,
        'Max. Temp.': 6.1,
        'Min. feels like': 0.6,
        'Max. feels like': 7.8,
        Day: {
          Precipitation: false,
          'Precipitation Type': null,    
          'Precipitation Intensity': null
        },
        Night: {
          Precipitation: false,
          'Precipitation Type': null,
          'Precipitation Intensity': null
        },
        'Air Quality Index': 75,
        'Wind Speed': 8,
        'Wind Direction': 'W'
      }
    var Notification = [];
    if (weatherDetails['Min. Temp.'] <= 0) {
        Notification.push({ "title": "Weather condition", "body": "Very cold temperature, Use Snow Jacket" })
    } else if (weatherDetails['Min. Temp.'] > 0 && weatherDetails['Min. Temp.'] < 15) {
        Notification.push({ "title": "Weather condition", "body": "Cool temperature, Use Winter Jacket" })
    }
    if (weatherDetails['Max. Temp.'] > 25 && weatherDetails['Max. Temp.'] <= 35) {
        Notification.push({ "title": "Weather condition", "body": "Warm temperature, Wear cotton or loose cloths" })
    } else if (weatherDetails['Max. Temp.'] > 35) {
        Notification.push({ "title": "Weather condition", "body": "Hot temperature, Wear cotton or loose cloths" })
    }
    if (weatherDetails["Air Quality Index"] > 150 && weatherDetails["Air Quality Index"] <= 300) {
        Notification.push({ "title": "Air Quality", "body": "Severe and unhealthy air quality" })
    } else if (weatherDetails["Air Quality Index"] > 300) {
        Notification.push({ "title": "Air Quality", "body": "Hazardous air quality, use mask and face sheild" })
    }
    if (weatherDetails["Wind Speed"] > 35) {
        Notification.push({ "title": "Wind condition", "body": "Heavy wind outside" });
    }
    if (weatherDetails["Day"]["Precipitation"] == true) {
        Notification.push({ "title": "Precipitation Type", "body": weatherDetails["Day"]["Precipitation Intensity"] + " " + weatherDetails["Day"]["Precipitation Type"] + " is expected" })
    }

    var sql = "SELECT * FROM user_profile WHERE deviceID = ?"
    var result;
    try {
        result = await query(sql, deviceID);
    } catch { }


    for (i = 0; i < result.length; i++) {
        var uID = result[i]['uID'];
        var sql1 = "SELECT * from inventory WHERE uID = ?";
        var result1 = await query(sql1, uID);

        AvailClothes = []
        WornClothes = []

        for (j = 0; j < ClothesCat.length; j++) {
            AvailClothes[j] = new Array(ClothesSubCat[j].length).fill(0)
            WornClothes[j] = new Array(ClothesSubCat[j].length).fill(0)
        }
        for (j = 0; j < result1.length; j++) {
            var cat = result1[j]['cType'] - 1;
            var subCat = result1[j]['cSubType'] - 1;
            if (result1[j]['used'] == 0 && result1[j]['availableInCloset'] == 1) {
                AvailClothes[cat][subCat] += 1
            }
            else {
                WornClothes[cat][subCat] += 1
            }

        }

        for (j = 0; j < AvailClothes.length; j++) {
            for (k = 0; k < AvailClothes[j].length; k++) {
                if (AvailClothes[j][k] < WornClothes[j][k])
                    Notification.push({ "title": "Laundry Notification", "body": result[i]['username'] + " requires laundry for category: " + ClothesCat[j] + ", Subcategory: " + ClothesSubCat[j][k] })
            }
        }
        //console.log(result[i]['username'])
        //console.log(AvailClothes)
        //console.log(WornClothes)

    }

    response = { "userOverview": users, "WeatherDetails": weatherDetails, "Notification": Notification }
    res.status(200).send(response);
})

app.post('/suggestClothes', async function (req, res) {
    if (!validate_session(req)) {
        res.status(401).send('Invalid Session')
        return;
    }
    var deviceID = req.body['deviceID'];
    var uID = req.body['uID'];
    //formal event
    const query = util.promisify(con.query).bind(con);
    sql = "SELECT * from user_profile WHERE uID = ? AND deviceID = ?"
    try {
        var result = await query(sql, [uID, deviceID]);
    } finally { }
    if (result.length == 0) {
        res.status(403).send('Pass valid User ID and device ID')
    }
    cType = 1
    cSubType = 3
    sql = "SELECT * from inventory WHERE uID = ? AND deviceID = ? AND cType = ? AND cSubType = ? AND used = 0 AND availableInCloset = 1"
    try {
        var result = await query(sql, [uID, deviceID, cType, cSubType]);
    } finally { }
    if (result.length == 0) {
        res.status(200).send('No Washed clothes available suitable for today\'s event')
    }
    response = []
    for (i = 0; i < result.length; i++) {
        temp = result[i]
        a = { 'RFID': temp['RFID'], 'cType': temp['cType'], 'cSubType': temp['cSubType'] }
        response.push(a)
    }

    try {
        // const { code } = //code
        //  const { tokens } = await oAuthClient.getToken(code);
        //res.send(tokens)

    } finally { }

})

app.get("/validate-session", function (req, res) {
    if (!validate_session(req)) {
      res.status(400).send({ success: false, message: "Invalid Session" });
    } else {
      res.status(200).send({ success: true, message: "Valid Session" });
    }
  });
  
  app.get("/logout", function (req, res) {
    res.cookie("session_token", "", { maxAge: 0 });
    res.json({ success: true });
  });

io.on('connection', function (socket) {
    socket.on('connected', function (deviceID1) {
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

/*app.post('/insertMultiple',function(req,res){
   RFID = 123456780;
   const query = util.promisify(con.query).bind(con);
   var sql = "INSERT INTO inventory VALUES (?,?,?,?,?,?,?)";
   for(i = 0; i< 50; i++){
      cType = parseInt(Math.random()*4)+1;
      cSubType = parseInt(Math.random()*4)+1;
      try{
         var result = query(sql, [RFID, 123456, 5857573, cType, cSubType, 0, 1])
      }catch{}
      RFID += 1;
   }
})*/