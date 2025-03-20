import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreateUser, Login } from "../types";
import db from "@/db";
import { usersTable } from "../user";
import { hashPassword } from "../utils/password";
import { tokenExpirationTime, verifyToken } from "@/utils/auth/jwt";

describe("Login user e2e", () => {
  it("should login an user", async () => {
    const password = "12345678";
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: hashPassword(password),
      birthdate: "1990-01-01",
    };

    const createdUser = (
      await db.insert(usersTable).values(user).returning().execute()
    )[0];

    const data: Login = {
      email: createdUser.email,
      password: password,
    };

    const request = new Request("http://localhost/auth/users/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body: { token: string; expiresIn: number } = await response.json();

    expect(body.expiresIn).toBe(tokenExpirationTime);

    expect(body.token).toBeTruthy();

    const decodedToken = await verifyToken(body.token);

    // check some of the token payload
    expect(decodedToken!.payload).toMatchObject({
      id: createdUser.id,
      sub: createdUser.id,
      email: createdUser.email,
    });

    expect(response.headers.get("Set-Cookie")).toInclude(`auth=${body.token}`);

    expect(response.status).toBe(200);
  });

  it("should return 401 when trying to login with uneregistered email", async () => {
    const data: Login = {
      email: "john.doe@gmail.com",
      password: "12345678",
    };

    const request = new Request("http://localhost/auth/users/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("InvalidCredentialsError");

    expect(response.status).toBe(401);
  });

  it("should return 401 when trying to login with wrong password", async () => {
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    await db.insert(usersTable).values(user).execute();

    const data: Login = {
      email: user.email,
      password: "wrong-password",
    };

    const request = new Request("http://localhost/auth/users/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("InvalidCredentialsError");

    expect(response.status).toBe(401);
  });
});
