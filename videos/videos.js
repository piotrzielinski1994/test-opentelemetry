import opentelemetry from '@opentelemetry/api';
import express from 'express';
import { videosDb, initTracing, wait } from './videos-helpers.js';

const tracer = initTracing('videos-ms');

const app = express();
app.listen(3000);

app.get('/videos/:videoId', async (req, res) => {
  const remoteCtx = opentelemetry.propagation.extract(
    opentelemetry.ROOT_CONTEXT,
    req.headers
  );
  const childSpan = tracer.startSpan('GET /videos/:videoId', remoteCtx);

  await wait(1000);

  const videoId = req.params.videoId;
  const video = videosDb.getVideo(videoId);

  res.send(video);
  childSpan.end();
});
