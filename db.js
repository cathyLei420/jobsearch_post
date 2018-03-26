var express = require('express'),
  app = express(),
  mongoose = require('mongoose');

var bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/main.html');
})
//schema
mongoose.connect('mongodb://lkfcp3:lkf101010@ds115758.mlab.com:15758/lkfcp3');
var db = mongoose.connection;

db.on('error', function() {
  console.log('error connect to db');
})

db.on('open', function() {
  console.log('connection done');
})

var UserSchema = mongoose.Schema({
  "user_id": Number,
  "username": {
    type: String,
    required: [true, 'this field cannot be blank']
  },
  "password": {
    type: String,
    //[true/false, customer error message you want to return]
    required: [true, 'this field cannot be blank']
    //maxlength,minlength
  },
  "type": {
    type: String
  },
  "email": {
    type: String
  },
  "location": String,
  "phone": String
});

var JobSchema = mongoose.Schema({
  "title": String,
  "description": String,
  "location": String,
  "keywords": String
});

var LoginSchema = mongoose.Schema({
  "loginuser": String
})



//one model to one collection
var User = mongoose.model('jobuser', UserSchema);
var Job = mongoose.model('jobs', JobSchema);
var Login = mongoose.model('loginuser', LoginSchema);

app.post('/createuser', function(req, res) {
  console.log(req.body);
  var user = new User(req.body);

  console.log(user);
  user.save(function(err) {
    if (!err) {
      console.log('user saved');
    } else {
      console.log(err);
    }
  });
});
app.post('/createjob', function(req, res) {
  console.log(req.body);
  var job = new Job(req.body);

  job.save(function(err) {
    if (!err) {
      console.log('job saved');
    } else {
      console.log(err);
    }
  })
})

app.post('/getuser', function(req, res) {
  console.log(req.body);
  User.find({
    "username": req.body.name
  }, function(err, docs) {
    if (!err) {
      console.log(docs);
      console.log(typeof(docs));
      res.send(docs);
    }
  });
});

app.post('/searchjob', function(req, res) {
  console.log(req.body);
  var job = req.body;
  for (var propName in job) {
    if (job[propName] === null || job[propName] === undefined) {
      delete job[propName];
    } else {
      var reg = new RegExp(".*" + job[propName] + ".*");
      job[propName] = reg;
    }
  }


  Job.find(
    job,
    function(err, docs) {
      if (!err) {
        console.log(docs);
        console.log(typeof(docs));
        res.send(docs);
      }
    });
})

app.post('/getloginuser', function(req, res) {
  Login.find({
    "loginuser": req.body.name
  }, function(err, docs) {
    if (!err) {
      res.send(docs);
    }
  })
})

app.post('/createlogin', function(req, res) {
  var login = new Login(req.body);

  login.save(function(err) {
    if (!err) {
      console.log('loginuser saved');
    } else {
      console.log(err);
    }
  })
})

app.get('/getloginuser', function(req, res) {
  Login.find({}, function(err, login) {
    if (!err) {
      res.send(login);
    }
  })
})

app.get('/deletelogin', function(req, res) {
  // Login.remove({}, function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('delete');
  //   }
  // })
  mongoose.connection.collections['loginusers'].drop(function(err, doc) {
    res.send(doc)
  });

})


app.listen(3000, function() {
  console.log("server running at localhost:3000")
})