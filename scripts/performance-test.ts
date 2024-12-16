import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 60 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["avg<100", "p(95)<200"],
    http_reqs: ["rate>2000"],
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
}
