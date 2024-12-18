// install k6 and run with:
// k6 run scripts/performance-test.ts
// to view dashboard:
//  k6 run --out web-dashboard scripts/performance-test.ts

import { sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 250 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["avg<100", "p(90)<200"],
  },
  noConnectionReuse: true,
};

export default function () {
  const data = {
    name: "Dog",
  };

  // basic POST request (first 201 created, then 409 conflict)

  http.post("http://localhost:3333/species", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });

  sleep(1);
}
