import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import {
  SimpleSpanProcessor,
  // BasicTracerProvider,
  // ConsoleSpanExporter,
  // BatchSpanProcessor,
} from '@opentelemetry/tracing';

const init = (serviceName) => {
  const jaegerExporter = new JaegerExporter({
    endpoint: `http://jaeger:14268/api/traces`,
  });
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
  provider.register();
  registerInstrumentations({
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  });

  const tracer = provider.getTracer(serviceName);

  return { tracer, provider };
};

export default init;
