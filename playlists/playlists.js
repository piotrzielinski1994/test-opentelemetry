import { trace } from '@opentelemetry/api';
import { wait, initTracing } from './helpers.js';
import express from 'express';
import cors from 'cors';

const { tracer, provider } = initTracing('my-service');
trace.setGlobalTracerProvider(provider);

const app = express();
app.use(cors()).listen(3000);

app.get('/', async (req, res) => {
  const span = tracer.startSpan('do operation');
  console.log('@@@ trace | ', trace.getActiveSpan());
  span.end();

  res.json([]);
});
