var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var mongo = require('mongodb');


var app = express();



app.use(bodyParser.json());
app.use(cors());

var Schema = mongoose.Schema;

var urlSchema = new Schema({
   originalUrl : String,
   shorterUrl : String
    
}, {timestamps: true});

var modelClass = mongoose.model('shortUrlSchema', urlSchema);





var linkToConnection = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/shortUrls';

mongoose.connect(linkToConnection, function(err){
  if(err){
   console.log(err);
  }else {
   console.log('mongoose connection is successful');
  }
 });


 

app.use(express.static(__dirname + '/public'));




app.get('/new/:urlToShorten(*)', (req, res)=> {
     
  var { urlToShorten } = req.params;
    
    
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    
  var regex = new RegExp(expression);
    
  if(urlToShorten.match(regex)) {
      var short = Math.floor(Math.random()*10000).toString();
      
      var data = new modelClass(
        {
            originalUrl: urlToShorten,
            shorterUrl: short
        }
      );
      
      data.save(err=> {
          if(err) {
              return res.send('Error saving to database');
          }
      });
      return res.json(data);
      
      
  } else {
      var data = new modelClass(
        {
           originalUrl: urlToShorten,
           shorterUrl: 'Invalid Url'
        }  
      );
      
      data.save(err=> {
          if(err) {
              return res.send('Error saving to database');
          }
      });
      
      return res.json(data);
  }
    
});


app.get('/:urlNumber', (req, res)=> {
   
   var numberUrl = req.params.urlNumber;
    
    modelClass.findOne({ 'shorterUrl': numberUrl}, function(err, doc) {
       if(err){
           return res.send('Error');
       } else {
           var rg = new RegExp("^(http|https)://", "i");
           var webLink = doc.originalUrl;
           if(rg.test(webLink)) {
               res.redirect(301, doc.originalUrl);
           } else {
               res.redirect(301, 'http://' + doc.originalUrl);
           }
           
       }
         
        
    });
   

});







app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});