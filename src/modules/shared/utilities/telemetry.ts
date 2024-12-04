import { env } from "@/env";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import Elysia from "elysia";

export const axiomTelemetry = () => (app: Elysia) => {
  if (!env.AXIOM_DATASET || !env.AXIOM_TOKEN) {
    return app;
  }

  console.info("Setting up telemetry");

  return opentelemetry({
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: "https://api.axiom.co/v1/traces",
          headers: {
            Authorization: `Bearer ${env.AXIOM_TOKEN}`,
            "X-Axiom-Dataset": env.AXIOM_DATASET,
          },
        }),
      ),
    ],
  });
};
