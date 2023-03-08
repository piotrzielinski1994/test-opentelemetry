const initTracing = require('./playlists-tracing.js');
const playlistsDb = require('./playlists-db');
const { videosClient } = require('./playlists-clients');
const api = require('@opentelemetry/api');

const { getContextFromRequest, startSpan } = initTracing('playlists-service');

const app = require('express')();
app.use(require('cors')());
app.listen(3000);

app.get('/playlists', async (req, res) => {
  const remoteContext = getContextFromRequest(req);
  console.log('@@@  | ', remoteContext === api.ROOT_CONTEXT);
  // const [wrapperSpan, wrapperContext] = startSpan('GET /playlists', remoteContext);

  // const [dbSpan] = startSpan('Database | Get playlists', remoteContext);
  const playlists = playlistsDb.getPlaylists();
  // dbSpan.end();

  const apiPlaylists = [];

  for (const playlist of playlists) {
    const videos = [];

    for (const videoId of playlist.videoIds) {
      // const [videoSpan] = startSpan(`Videos Client | Get ${videoId}`, remoteContext);
      try {
        const video = await videosClient.getVideo(videoId);
        videos.push(video);
      } catch (error) {
        console.log('@@@ error | ', error.message);
      }
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
