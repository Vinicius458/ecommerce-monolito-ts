import { app } from "../express";
import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel as ProductAdm } from "../../modules/product-adm/repository/product.model";
import { ProductModel } from "../../modules/store-catalog/repository/product.model";
import { Umzug } from "umzug/lib/umzug";
import { migrator } from "../../infrastructure/migrations/config-migrations/migrator";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import ItemModel from "../../modules/invoice/repository/item.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { Sequelize } from "sequelize-typescript";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      ProductModel,
      ProductAdm,
      ClientModel,
      InvoiceModel,
      ItemModel,
      OrderModel,
      TransactionModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should do the checkout", async () => {
    await ClientModel.create({
      id: "1",
      name: "Lucian",
      email: "lucian@123.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ProductAdm.create({
      id: "1",
      name: "My Product",
      description: "Product description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await ProductAdm.findAll();
    await ProductAdm.create({
      id: "2",
      name: "My Product 2",
      description: "Product description",
      purchasePrice: 25,
      salesPrice: 25,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      });

    expect(response.status).toEqual(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toEqual(125);
    expect(response.body.status).toEqual("approved");
  });
});
