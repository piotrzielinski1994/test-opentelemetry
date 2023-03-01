import opentelemetry from '@opentelemetry/api';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const initTracing = (serviceName) => {
  const jaegerExporter = new JaegerExporter({
    endpoint: `http://jaeger:14268/api/traces`,
  });
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

  opentelemetry.trace.setGlobalTracerProvider(provider);

  registerInstrumentations({
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
    tracerProvider: provider,
  });

  const tracer = opentelemetry.trace.getTracer('playlists-ms');

  return {
    tracer: tracer,
    startSpan: startSpan(tracer),
    getContextFromRequest: getContextFromRequest,
  };
};

const startSpan = (tracer) => (name, parentContext) => {
  const span = tracer.startSpan(name, {}, parentContext);
  return [span, opentelemetry.trace.setSpan(parentContext, span)];
};

const getContextFromRequest = (req) => {
  return opentelemetry.propagation.extract(opentelemetry.ROOT_CONTEXT, req.headers);
};

export default initTracing;
