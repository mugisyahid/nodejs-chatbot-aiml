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


//AIML interpreter
aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'Isma', age:'18'}, 'Goodbye');

fs.readdir('./aiml', (err, files) => {
  files.forEach(file => {
    interpreter.loadFiles(['./aiml/'+file]);
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
    jsonRequest = request.body
    jsonRequest.type = 'answerBot'
    console.log(jawab)
    interpreter.findAnswer(request.body.param.question, callback);
    console.log(jawab)
    jsonRequest.param.answer = jawab
    response.send(jsonRequest);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
