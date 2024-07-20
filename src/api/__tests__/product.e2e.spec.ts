import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should add a new product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
