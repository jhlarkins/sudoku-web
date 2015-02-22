var compression = require('compression');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var contentDir = __dirname + '/../out';
console.log('Serving content from %s', contentDir);
app.use(compression());
app.use(express.static(contentDir));
app.listen(port);
console.log('Server listening on port %s', port);
