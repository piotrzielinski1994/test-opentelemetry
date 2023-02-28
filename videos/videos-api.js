import express from 'express';
import { wait } from './videos-helpers.js';
import initTracing from './videos-tracing.js';
import videosDb from './videos-db.js';

const { getContextFromRequest, startSpan } = initTracing('videos-ms');

const app = express();
app.listen(3000);

app.get('/videos/:videoId', async (req, res) => {
  const videoId = Number(req.params.videoId);

  const remoteContext = getContextFromRequest(req);
  const [wrapperSpan, wrapperContext] = startSpan(`GET /video/${videoId}`, remoteContext);

  const [dbSpan] = startSpan('db | Get video', wrapperContext);
  const video = videosDb.getVideo(videoId);
  dbSpan.end();

  await wait(1000);

  res.send(video);
  wrapperSpan.end();
});
