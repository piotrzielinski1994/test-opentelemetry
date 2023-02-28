const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send({
    data: 'Playlists',
  });
});

app.listen(3000);
