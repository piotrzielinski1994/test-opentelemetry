const api = require('@opentelemetry/api');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

// api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.DEBUG);

const initTracing = (serviceName) => {
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
    instrumentations: [],
  });

  const tracer = provider.getTracer(serviceName);

  return {
    tracer: tracer,
    startSpan: startSpan(tracer),
    getContextFromRequest: getContextFromRequest,
  };
};

const startSpan = (tracer) => (name, parentContext) => {
  const span = tracer.startSpan(name, {}, parentContext);
  return [span, api.trace.setSpan(parentContext, span)];
};

const getContextFromRequest = (req) => {
  return api.propagation.extract(api.ROOT_CONTEXT, req.headers);
};

module.exports = initTracing;
