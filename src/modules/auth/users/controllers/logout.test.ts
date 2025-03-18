import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { signToken } from "@/modules/shared/auth/jwt";

describe("Logout user e2e", () => {
  it("should logout an user", async () => {
    const token = await signToken({
      id: "00000000-0000-0000-0000-000000000000",
      email: "jonh.doe@gmail.com",
    });

    const request = new Request("http://localhost/auth/users/logout", {
      method: "POST",
      headers: {
        Cookie: `auth=${token}`,
      },
    });

    const response = await app.handle(request);

    expect(response.headers.get("Set-Cookie")).toInclude(`auth=; Max-Age=0`);

    expect(response.status).toBe(204);
  });

  it("should return 401 when trying to logout with invalid token", async () => {
    const request = new Request("http://localhost/auth/users/logout", {
      method: "POST",
      headers: {
        Cookie: "auth=invalid-token",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("Unauthorized");

    expect(response.status).toBe(401);
  });
});
