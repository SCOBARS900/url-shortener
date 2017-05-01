var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();


app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));




app.get('/new/:urlToShorten(*)', (req, res)=> {
     
  var { urlToShorten } = req.params;
    
  return res.json({urlToShorten});

});








app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});