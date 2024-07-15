import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/facade.factory";
import InvoiceModel from "../repository/invoice.model";
import ItemModel from "../repository/item.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
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
    };

    await invoiceFacade.generateInvoice(input);

    const invoiceModel = await InvoiceModel.findAll({
      include: [{ model: ItemModel }],
    });
    const invoice = invoiceModel[0];
    expect(invoice).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.total).toBe(80);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      id: "any_id_1",
    };
    const output = {
      id: "any_id_1",
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
    };

    await InvoiceModel.create(
      {
        id: output.id,
        name: output.name,
        document: output.document,
        street: output.street,
        number: output.number,
        complement: output.complement,
        city: output.city,
        state: output.state,
        zipCode: output.zipCode,
        items: output.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
        })),
        total: output.total,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: ItemModel }],
      }
    );

    const result = await invoiceFacade.findInvoice(input);

    expect(result).toBeDefined();
    expect(result.name).toBe(output.name);
    expect(result.document).toBe(output.document);
    expect(result.address.street).toBe(output.street);
    expect(result.items[0].id).toBe(output.items[0].id);
    expect(result.total).toBe(output.total);
  });
});
