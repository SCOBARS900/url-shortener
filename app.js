var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var useragent = require('express-useragent');


var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(useragent.express());


app.set('port', (process.env.PORT || 3000));












app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});