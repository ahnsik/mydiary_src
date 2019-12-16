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
  var date_string;
  var date;
  if (req.query.date) {   // parameter 에 date 가 있으면..
    query_string = 'select * from mydiary where date="'+req.query.date+'";' ;
    date_string = req.query.date;
    date = new Date(date_string);
  } else if (req.query.search) {    // parameter 에 search 가 있으면.. 키워드에 해당하는 목록만 표시함.
    date = new Date();
    date_string = null;
    query_string = 'select * from mydiary where memo like "%'+req.query.search+'%";' ;
  } else {    // parameter 가 없으면, 현재 시각을 기준으로 현재의 달 (1일부터 1달간)의 데이터만 가져와서 표시.
    date = new Date();
    let start_date = new Date(date.getFullYear(),date.getMonth(), 1 );
    let end_date = new Date(date.getFullYear(),date.getMonth()+1, 0);
    date_string = null;
    // 범위를 지정해서 해당하는 '월' 의 데이터만 가져 온다.
    query_string = 'select * from mydiary where date between date("' + start_date.toLocaleDateString() + '") and date("' + end_date.toLocaleDateString() + '");' ;
  }
  console.log ( query_string );

  db.query(query_string, function(err, result, fields) {
    if (err) throw err;
    // console.log(result);
    res.render('./new_form.ejs', { db:result, curr:date });
  });
});

app.post('/new_diary', function(req, res) {
  console.log('access to ' + '/new_diary' );
  console.log ( req.body );
  if (req.query.date) {   // parameter 에 date 가 있으면..
    // var query_string = 'insert into mydiary(date,memo) values ("'+req.query.date + '","'+ req.body.memo +'");';
    var query_string = 'update mydiary set memo="' + req.body.memo + '", date="'+ req.query.date + '" where date="' + req.query.date + '";';
  } else {
    var query_string = 'insert into mydiary(date,memo) values ("'+new Date().toLocaleString() + '","'+ req.body.memo +'");';
  }

  console.log ( query_string );
  db.query(query_string);
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
