// seed db with:
// bun db:seed --count=30000
// build application with:
// bun run build
// run application with:
// bun start
// run benchmark with:
// install k6 and run with:
// k6 run scripts/performance-test.ts
// to view dashboard:
// k6 run --out web-dashboard scripts/benchmark.ts

import { sleep } from "k6";
import { SharedArray } from "k6/data";
import { scenario } from "k6/execution";
import http from "k6/http";

const data = new SharedArray("requests", function () {
  return JSON.parse(open("./data/requests.json"));
});

const host = __ENV.HOST || `http://localhost:${__ENV.PORT || 3333}`;

export const options = {
  stages: [
    { duration: "5s", target: 100 },
    { duration: "15s", target: 100 },
    { duration: "5s", target: 200 },
    { duration: "15s", target: 200 },
    { duration: "5s", target: 300 },
    { duration: "15s", target: 300 },
    { duration: "5s", target: 400 },
    { duration: "15s", target: 400 },
    { duration: "5s", target: 500 },
    { duration: "15s", target: 500 },
    { duration: "5s", target: 600 },
    { duration: "15s", target: 600 },
    { duration: "5s", target: 700 },
    { duration: "15s", target: 700 },
    { duration: "5s", target: 800 },
    { duration: "15s", target: 800 },
    { duration: "5s", target: 900 },
    { duration: "15s", target: 900 },
    { duration: "5s", target: 1000 },
    { duration: "55s", target: 1000 },
  ],
};

export default function () {
  const params = data[scenario.iterationInTest % data.length];
  const url = `${host}${params}`;
  http.get(url, {
    headers: {
      Connection: "keep-alive",
      "Keep-Alive": "timeout=5, max=1000",
    },
    tags: { name: "fetch" },
    timeout: "30s",
  });

  sleep(0.1 * (scenario.iterationInTest % 6));
}
