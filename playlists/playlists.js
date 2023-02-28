import opentelemetry from '@opentelemetry/api';
import { initTracing, playlistsDb, videosClient } from './playlists-helpers.js';
import express from 'express';
import cors from 'cors';

const tracer = initTracing('playlists-ms');

const app = express();
app.use(cors()).listen(3000);

app.get('/playlists', async (req, res) => {
  const remoteCtx = opentelemetry.propagation.extract(
    opentelemetry.ROOT_CONTEXT,
    req.headers
  );
  const childSpan = tracer.startSpan('childSpan', remoteCtx);

  const playlists = playlistsDb.getPlaylists();
  const apiPlaylists = await playlists.map(async (playlist) => {
    const videoPromises = playlist.videoIds.map((videoId) => {
      return videosClient.getVideo(videoId);
    });

    const videos = await Promise.all(videoPromises);

    return {
      id: playlist.id,
      title: playlist.title,
      videos: videos,
    };
  });

  res.json(await Promise.all(apiPlaylists));

  childSpan.end();
});
