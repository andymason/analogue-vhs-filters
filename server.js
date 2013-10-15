var connect = require('connect');
console.log('Connected to localhost:8080');
var app = connect().use(connect.static(__dirname));
app.listen(8080);