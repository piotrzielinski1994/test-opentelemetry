const initTracing = require('./videos-tracing.js');
const api = require('@opentelemetry/api');
const { wait } = require('./videos-helpers.js');
const videosDb = require('./videos-db.js');
const { getContextFromRequest, startSpan } = initTracing('videos-service');

const app = require('express')();
app.use(require('cors')());
app.listen(3000);

app.get('/videos/:videoId', async (req, res) => {
  const videoId = Number(req.params.videoId);

  // const remoteContext = getContextFromRequest(req);
  // const [wrapperSpan, wrapperContext] = startSpan(`GET /video/${videoId}`, remoteContext);

  // const [dbSpan] = startSpan('db | Get video', wrapperContext);
  const video = await videosDb.getVideo(videoId);
  // dbSpan.end();

  await wait(500);

  res.send(video);
  // wrapperSpan.end();
});
