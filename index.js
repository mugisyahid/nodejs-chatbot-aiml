var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//core-js
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//AIML interpreter
aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'Isma', age:'18', gender: 'Female'}, 'Goodbye');

fs.readdir('./aiml', (err, files) => {
  files.forEach(file => {
    interpreter.loadFiles(['./aiml/'+file]);
  });
})

fs.readdir('./aiml-mitsuku', (err, files) => {
  files.forEach(file => {
    interpreter.loadFiles(['./aiml-mitsuku/'+file]);
  });
})


fs.readdir('./aiml-alice', (err, files) => {
  files.forEach(file => {
    interpreter.loadFiles(['./aiml-alice/'+file]);
  });
})



let jawab = ''
var callback = function(answer, wildCardArray, input){
      jawab = answer
};


let jsonRequest = {
  "version": "1.0",
  "type": "askBot",
  "callbackUrl": "callbackUrl",
  "uuid" : "xxxxx",
  "param":
    {
      "question": "question",
      "answer" : "answer"
    }
}

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/', function(request, response){
if(request.body.type == 'askBot'){
    jsonRequest = request.body
    jsonRequest.type = 'answerBot'
    interpreter.findAnswer(request.body.param.question, callback);
    if(jawab){
      jsonRequest.param.answer = jawab
    }else{
      jsonRequest.param.answer = request.body.param.answer
    }
    response.send(jsonRequest);
  }else{
    response.send('not ok');
  }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
