import { Sequelize } from "sequelize-typescript";
import ItemModel from "./item.model";
import InvoiceItems from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceRepostiory from "./invoice.repository";
import InvoiceModel from "./invoice.model";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ItemModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save an invoice", async () => {
    const address = new Address(
      "Street 54",
      "66",
      "any_complement",
      "Miami",
      "Florida",
      "5453344"
    );

    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "any_item",
      price: 50,
    });

    const invoice = new Invoice({
      name: "Invoice_1",
      document: "Any_document",
      address,
      items: [invoiceItem],
    });

    invoice.sum();
    const repository = new InvoiceRepostiory();
    await repository.save(invoice);

    const invoiceModel = await InvoiceModel.findByPk(invoice.id.id, {
      include: ["items"],
    });

    expect(invoiceModel.name).toBe("Invoice_1");
    expect(invoiceModel.document).toBe("Any_document");
    expect(invoiceModel.street).toBe("Street 54");
    expect(invoiceModel.number).toBe("66");
    expect(invoiceModel.complement).toBe("any_complement");
    expect(invoiceModel.city).toBe("Miami");
    expect(invoiceModel.state).toBe("Florida");
    expect(invoiceModel.zipCode).toBe("5453344");
    expect(invoiceModel.items[0].name).toBe("any_item");
    expect(invoiceModel.items[0].price).toBe(50);
    expect(invoiceModel.total).toBe(50);
  });

  it("should find an invoice", async () => {
    const address = new Address(
      "Street 54",
      "66",
      "any_complement",
      "Miami",
      "Florida",
      "5453344"
    );

    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "any_item",
      price: 50,
    });

    const invoice = new Invoice({
      name: "Invoice_1",
      document: "Any_document",
      address,
      items: [invoiceItem],
    });

    invoice.sum();

    const invoiceModel = await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [{ model: ItemModel }],
      }
    );
    const repository = new InvoiceRepostiory();
    const invoiceResult = await repository.find(invoice.id.id);
    expect(invoiceResult.name).toBe("Invoice_1");
    expect(invoiceResult.document).toBe("Any_document");
    expect(invoiceResult.address.street).toBe("Street 54");
    expect(invoiceResult.address.number).toBe("66");
    expect(invoiceResult.address.complement).toBe("any_complement");
    expect(invoiceResult.address.city).toBe("Miami");
    expect(invoiceResult.address.state).toBe("Florida");
    expect(invoiceResult.address.zipCode).toBe("5453344");
    expect(invoiceResult.items[0].name).toBe("any_item");
    expect(invoiceResult.items[0].price).toBe(50);
    expect(invoiceResult.total).toBe(50);
  });
});
