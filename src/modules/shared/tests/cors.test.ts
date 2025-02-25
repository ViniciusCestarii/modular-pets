import { app } from "@/app";
import { it, expect } from "bun:test";
it("should pass preflight", async () => {
  const preflightRequest = new Request("http://localhost", {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost",
    },
  });

  const response = await app.handle(preflightRequest);

  expect(response.status).toBe(204);
});
