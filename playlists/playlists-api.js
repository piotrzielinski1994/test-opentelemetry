const init = require('./playlists-tracing.js');

init('playlists-service');

const api = require('@opentelemetry/api');
const express = require('express');
const cors = require('cors');
const playlistsDb = require('./playlists-db');
const { videosClient } = require('./playlists-clients');

const app = express();

app.use(cors());
app.listen(3000);

app.get('/playlists', async (req, res) => {
  // const remoteContext = getContextFromRequest(req);
  // const [wrapperSpan, wrapperContext] = startSpan('GET /playlists', remoteContext);

  // const [dbSpan] = startSpan('db | Get playlists', wrapperContext);
  const playlists = playlistsDb.getPlaylists();
  // dbSpan.end();

  const apiPlaylists = [];

  for (const playlist of playlists) {
    const videos = [];

    for (const videoId of playlist.videoIds) {
      // const [videoSpan] = startSpan(`videos-ms | Get ${videoId}`, wrapperContext);

      const video = await videosClient.getVideo(videoId).catch((e) => {
        // videoSpan.setStatus({
        //   code: opentelemetry.SpanStatusCode.ERROR,
        //   message: e.message,
        // });
        throw e;
      });
      videos.push(video);
      // videoSpan.end();
    }

    apiPlaylists.push({
      id: playlist.id,
      title: playlist.title,
      videos: videos,
    });
  }

  res.json(apiPlaylists);

  // wrapperSpan.end();
});
