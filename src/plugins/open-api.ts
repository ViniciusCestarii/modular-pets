import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const openApi =
  () =>
  (app: Elysia): Elysia => {
    return app.use(
      swagger({
        documentation: {
          info: {
            title: "Modular-Pets API",
            version: "1.0.0",
            description: "Modular-Pets API Documentation",
          },
          tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Pet", description: "Pet module endpoints" },
            { name: "Health", description: "Health endpoints" },
          ],
        },
      }),
    );
  };
