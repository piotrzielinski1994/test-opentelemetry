import { trace, propagation, SpanKind, ROOT_CONTEXT } from '@opentelemetry/api';
import { wait, initTracing } from './helpers.js';
import express from 'express';
import cors from 'cors';

const { tracer, provider } = initTracing('asd2');
trace.setGlobalTracerProvider(provider);

const app = express();
app.use(cors()).listen(3000);

app.get('/', async (req, res) => {
  const remoteCtx = propagation.extract(ROOT_CONTEXT, req.headers);
  const childSpan = tracer.startSpan('childSpan', remoteCtx);
  await wait(5000);
  const childSpan2 = tracer.startSpan('childSpan2', childSpan);
  await wait(1000);
  childSpan2.end();
  res.json([]);
  childSpan.end();
});
