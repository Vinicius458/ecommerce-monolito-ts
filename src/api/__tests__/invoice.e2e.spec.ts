import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const response = await request(app)
      .post("/invoice")
      .send({
        name: "Invoice_1",
        document: "Any_document",
        street: "Street 54",
        number: "66",
        complement: "any_complement",
        city: "Miami",
        state: "Florida",
        zipCode: "5453344",
        items: [
          {
            id: "1",
            name: "any_item",
            price: 50,
          },
          { id: "2", name: "any_item_2", price: 30 },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(2);

    expect(response.body).toEqual({
      id: expect.any(String),
      name: "Invoice_1",
      document: "Any_document",
      street: "Street 54",
      number: "66",
      complement: "any_complement",
      city: "Miami",
      state: "Florida",
      zipCode: "5453344",
      items: [
        {
          id: "1",
          name: "any_item",
          price: 50,
        },
        { id: "2", name: "any_item_2", price: 30 },
      ],
      total: 80,
    });
  });
});
