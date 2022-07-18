import { Connection } from "typeorm";
import createConnection from '../../../../database/index'
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to return token for an user", async () => {
    const user = {
      name: "User test",
      email: "user@test.com.br",
      password: "12345",
    }
    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })

    expect(response.body).toHaveProperty("token")
  });
})
