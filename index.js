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



function initBrain(){
  var intprtr = new aimlHigh({name:'Isma', age:'18', gender: 'Female'}, 'Goodbye');
  fs.readdir('./aiml', (err, files) => {
    files.forEach(file => {
       intprtr.loadFiles(['./aiml/'+file]);
    });
  })

  // fs.readdir('./aiml-mitsuku', (err, files) => {
  //   files.forEach(file => {
  //     intprtr.loadFiles(['./aiml-mitsuku/'+file]);
  //   });
  // })
  //
  //
  // fs.readdir('./aiml-alice', (err, files) => {
  //   files.forEach(file => {
  //     console.log(file)
  //     intprtr.loadFiles(['./aiml-alice/'+file]);
  //   });
  // })

  return intprtr;

}


var interpreter = initBrain();



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




try{
    if(request.body.type == 'askBot'){
        jsonRequest = request.body
        jsonRequest.type = 'answerBot'
        jsonRequest.param.answer = request.body.param.answer


        interpreter.findAnswer(request.body.param.question, callback);
        if(jawab){
          jsonRequest.param.answer = jawab
        }
        response.send(jsonRequest);
      }else{
        response.send('not ok');
      }
    }catch(e){
      console.log(e)
      // interpreter = initBrain(); bad things!
      jsonRequest.param.answer = 'Something went wrong. Restarting my Brain :)'
      response.send(jsonRequest);
    }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
