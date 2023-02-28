import opentelemetry from '@opentelemetry/api';
import {
  initTracing,
  playlistsDb,
  videosClient,
  wait,
} from './playlists-helpers.js';
import express from 'express';
import cors from 'cors';

const tracer = initTracing('playlists-ms');

const app = express();
app.use(cors()).listen(3000);

app.get('/playlists', async (req, res) => {
  const remoteContext = opentelemetry.propagation.extract(
    opentelemetry.ROOT_CONTEXT,
    req.headers
  );
  const wrapperSpan = tracer.startSpan('GET /playlists', {}, remoteContext);
  const wrapperContext = opentelemetry.trace.setSpan(
    remoteContext,
    wrapperSpan
  );
  const dbSpan = tracer.startSpan('db | Get playlists', {}, wrapperContext);
  const playlists = playlistsDb.getPlaylists();
  dbSpan.end();

  const apiPlaylists = [];

  for (const playlist of playlists) {
    const videos = [];

    for (const videoId of playlist.videoIds) {
      const videoSpan = tracer.startSpan(
        `videos-ms | GET /videos/${videoId}`,
        {},
        wrapperContext
      );
      const video = await videosClient.getVideo(videoId);
      console.log('@@@ video | ', video);
      videos.push(video);
      videoSpan.end();
    }

    apiPlaylists.push({
      id: playlist.id,
      title: playlist.title,
      videos: videos,
    });
  }

  res.json(await Promise.all(apiPlaylists));

  wrapperSpan.end();
});
