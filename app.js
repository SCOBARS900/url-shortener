var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');

var shortUrl = require('./models/shortUrl')
var app = express();


app.use(bodyParser.json());
app.use(cors());

var db = process.env.MONGOLAB_URI;

mongoose.connect(db, function(err){
  if(err){
   console.log(err);
  }else {
   console.log('mongoose connection is successful on: ' + db);
  }
 });


 


app.use(express.static(__dirname + '/public'));




app.get('/new/:urlToShorten(*)', (req, res)=> {
     
  var { urlToShorten } = req.params;
    
    
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    
  var regex = new RegExp(expression);
    
  if(urlToShorten.match(regex)) {
      var short = Math.floor(Math.random()*10000).toString();
      
      var data = new shortUrl(
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
      var data = new shortUrl(
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


app.get('/:urlToForward', (req, res)=> {
   var shorterUrl = req.params.urlToForward;
   
   shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data)=>{
      if(err) {
          return res.send('Error reading database');
      } else {
          var re = new RegExp("^(http|https)://", "i");
          var strToCheck = data.originalUrl;
          if(re.test(strToCheck)){
              res.redirect(301, data.originalUrl);
          } else {
              res.redirect(301, 'http://' + data.originalUrl);
          }
      }
       
   });
    
});





app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});