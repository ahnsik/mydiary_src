var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World !');
});

app.listen(6437, function() {
  console.log('Server ON! woth port_num:6437');
});
