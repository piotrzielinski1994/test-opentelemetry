const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Playlists');
});

app.listen(3000);
