const express = require('express');
const app = express();
var cors = require('cors');

app.use(cors());

app.get('/', async (req, res) => {
  const playlists = [
    {
      id: 1,
      name: 'Playlist 1',
      videos: [
        {
          id: 1,
          name: 'Video 1',
        },
        {
          id: 2,
          name: 'Video 2',
        },
      ],
    },
    {
      id: 2,
      name: 'Playlist 2',
      videos: [
        {
          id: 3,
          name: 'Video 3',
        },
        {
          id: 4,
          name: 'Video 4',
        },
      ],
    },
  ];

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  res.send(playlists);
});

app.listen(3000);
