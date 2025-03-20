import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreateUser, UserRegisterReturn } from "../types";
import db from "@/db";
import { usersTable } from "../user";
import { tokenExpirationTime, verifyToken } from "@/utils/auth/jwt";

describe("Create user e2e", () => {
  it("should create a new user successfully", async () => {
    const data: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    const request = new Request("http://localhost/auth/users/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body: UserRegisterReturn & { expiresIn: number } =
      await response.json();

    expect(body.user).toMatchObject({
      id: expect.any(String),
      name: data.name,
      email: data.email,
      birthdate: data.birthdate,
    });

    // @ts-expect-error user should not return password
    expect(body.user.password).toBeUndefined();

    expect(body.token).toBeTruthy();

    const decodedToken = await verifyToken(body.token);

    // check some of the token payload
    expect(decodedToken!.payload).toMatchObject({
      id: body.user.id,
      sub: body.user.id,
      email: body.user.email,
    });

    expect(body.expiresIn).toBe(tokenExpirationTime);

    expect(response.headers.get("Set-Cookie")).toInclude(`auth=${body.token}`);

    expect(response.status).toBe(201);
  });

  it("should return 409 when trying to create a user that already exists", async () => {
    const data: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    await db.insert(usersTable).values(data).execute();

    const request = new Request("http://localhost/auth/users/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("UserAlreadyExistsError");

    expect(response.status).toBe(409);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/auth/users/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });
});
