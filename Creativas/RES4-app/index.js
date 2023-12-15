var express = require('./node_modules/express');
var app = express();
app.use(express.static('src'));
app.use(express.static('../res4-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});
app.listen(3071, function () {
  console.log('Digital Asset listening on port 3071!');
});
