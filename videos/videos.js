const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send({
    data: 'Videos',
  });
});

app.listen(3000);
