import express from 'express';
import cors from 'cors';
import initTracing from './playlists-tracing.js';
import playlistsDb from './playlists-db.js';
import { videosClient } from './playlists-clients.js';
import opentelemetry from '@opentelemetry/api';

const { getContextFromRequest, startSpan } = initTracing('playlists-ms');

const app = express();
app.use(cors()).listen(3000);

app.get('/playlists', async (req, res) => {
  const remoteContext = getContextFromRequest(req);
  const [wrapperSpan, wrapperContext] = startSpan('GET /playlists', remoteContext);

  const [dbSpan] = startSpan('db | Get playlists', wrapperContext);
  const playlists = playlistsDb.getPlaylists();
  dbSpan.end();

  const apiPlaylists = [];

  for (const playlist of playlists) {
    const videos = [];

    for (const videoId of playlist.videoIds) {
      const [videoSpan] = startSpan(`videos-ms | Get ${videoId}`, wrapperContext);

      // let output = {};
      // const qwe = opentelemetry.propagation.inject(
      //   opentelemetry.trace.setSpan(wrapperContext, videoSpan),
      //   output
      // );
      // const { traceparent, tracestate } = output;

      // console.log('@@@  | ', qwe, output, traceparent, tracestate);

      const video = await videosClient.getVideo(videoId).catch((e) => {
        videoSpan.setStatus({
          code: opentelemetry.SpanStatusCode.ERROR,
          message: e.message,
        });
        throw e;
      });
      videos.push(video);
      videoSpan.end();
    }

    apiPlaylists.push({
      id: playlist.id,
      title: playlist.title,
      videos: videos,
    });
  }

  res.json(apiPlaylists);

  wrapperSpan.end();
});
