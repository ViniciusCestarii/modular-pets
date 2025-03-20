import Elysia from "elysia";

export const errorMiddleware =
  () =>
  (app: Elysia): Elysia => {
    return app.onError(({ code, error, request, body }) => {
      if (process.env.NODE_ENV !== "test") {
        console.error(
          JSON.stringify(
            {
              timestamp: new Date().toString(),
              level: "error",
              code,
              url: request.url,
              body: body,
              error: error.toString(),
            },
            null,
            2,
          ),
        );

        // check to not overflood the logs with validation errors
        if (code !== "VALIDATION") {
          console.error(error);
        }
      }

      if (
        code === "UNKNOWN" ||
        code === "INTERNAL_SERVER_ERROR" ||
        code === 500 ||
        code === "PARSE"
      ) {
        return error;
      }
    });
  };
