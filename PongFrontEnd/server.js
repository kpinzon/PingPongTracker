var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var routes = require('./config/routes');
var PORT = process.env.PORT || 3000;
var app = express();

//Allowing me access to my enviornment variables
// require('dotenv').load()

// mount all routes with appropriate base paths


//connect front end to back end
app.use(express.static(path.join(__dirname)));

// Mountin BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(PORT, function () {
    console.log('Listening on PORT 3000');
})



module.exports = app;
