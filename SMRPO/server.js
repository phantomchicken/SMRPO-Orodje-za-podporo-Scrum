const express = require("express");
const path = require("path");
var dbApi = require('./src/api/routes/db');
/**
 * Database connection
 */
 require("./src/api/models/db.js");

/**
 * Create server
 */
const port = process.env.PORT || 3000;
const app = express();
/**
 * Default response
 */
app.get("/", (req, res) => {
    res.send("<h1>Welcome to SMRPO!</h1>");
});
/**
 * Start server
 */
app.listen(port, () => {
    console.log(`Demo app listening on port ${port}!`);
});


var URI = 'http://localhost:4200';
if (process.env.NODE_ENV === 'production') {
  //URI = 'https://rentdrive-sp.herokuapp.com'
} else if (process.env.NODE_ENV === 'docker') {
  URI = 'http://localhost:3000';
}

app.use('/api', (req, res, next) => {
    //res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); //should solve CORS error? (put heroku link later)
    res.header('Access-Control-Allow-Origin', URI);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

app.use('/api/db', dbApi);

module.exports = app;
