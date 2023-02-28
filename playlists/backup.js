import express from 'express';
import cors from 'cors';
import * as api from '@opentelemetry/api';
import init from './tracing.js';

const asd = init('playlists-service');

const app = express();
app.use(cors()).listen(3000);

app.get('/', async (req, res) => {
  // const activeSpan = api.trace.getSpan(api.context.active());
  const activeSpan = api.trace.getSpan(api.context.active());
  // console.log('@@@ activeSpan | ', activeSpan);
  // console.log('@@@ asd | ', asd.tracer);
  console.log('@@@ qwe | ', api.context.active());
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

  res.send(playlists);
});

function wait(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
