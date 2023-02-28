import { trace } from '@opentelemetry/api';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export const initTracing = (serviceName) => {
  const jaegerExporter = new JaegerExporter({
    endpoint: `http://jaeger:14268/api/traces`,
  });
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

  registerInstrumentations({
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  });

  const tracer = trace.getTracer('tracer-application');

  return {
    tracer,
    provider,
  };
};

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
