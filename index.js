var express = require('express');
var mysql  = require('mysql');
var fs  = require('fs');
var mysqlconfig = require('./mysqlconfig.json');
var connection = mysql.createConnection(mysqlconfig);

var bodyParser = require('body-parser');
var app = express();
var db = mysql.createConnection ( mysqlconfig );

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', function(req, res) {
  console.log('access to ' + '/' );
  res.send('Hello World ! - root<br/><br/>' + 'access to /diary to diary test.');
});

app.get('/diary', function(req, res) {
  console.log('access to ' + '/diary/' );
  var query_string;
  if (req.query.date) {   // parameter 에 date 가 있으면..
    query_string = 'select * from mydiary where date="'+req.query.date+'";' ;
  } else {
    query_string = 'select * from mydiary;' ;
  }
  console.log ( query_string );

  db.query(query_string, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.render('./new_form.ejs', { db:result });
  });
});

app.post('/new_diary', function(req, res) {
  console.log('access to ' + '/new_diary' );
  console.log ( req.body );
  var query_string = 'insert into mydiary(date,memo) values ("'+new Date().toLocaleString() + '","'+ req.body.memo +'");';
  console.log ( query_string );
  db.query(query_string);
  // var data = fs.readFileSync('./new_form.html', 'utf8');
  // res.send(data);
  res.redirect('/diary');
});

// mysql> insert into mydiary (date, memo) values ("20191209120000", "What is these situation?");
// mysql> update mydiary set memo="Dummy" where date="20191209120000" ;   // timestamp로 지정해서, 수정한 시각에 따라 실제 timestamp 값이 바뀌고 있음. 또한 key로 못찾는 경우엔 아무것도 안함.
// mysql> select * from mydiary;
// mysql> delete from mydiary where date=20191209122643;


var port_num = 3000;
app.listen(port_num, function() {
  console.log('Example App started on port ' + port_num + ' !');
});
