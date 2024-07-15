import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "./../../../@shared/domain/value-object/address";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const address = new Address(
  "Street 54",
  "66",
  "any_complement",
  "Miami",
  "Florida",
  "5453344"
);
const item1 = new InvoiceItems({
  id: new Id("1"),
  name: "any_item",
  price: 50,
});
const item2 = new InvoiceItems({
  id: new Id("2"),
  name: "any_item_2",
  price: 30,
});

const invoice = new Invoice({
  name: "Invoice_1",
  document: "Any_document",
  address,
  items: [item1, item2],
});

invoice.sum();

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};
describe("Generate invoice usecase unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
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

    const result = await usecase.execute(input);

    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(result.name).toBe("Invoice_1");
    expect(result.document).toBe("Any_document");
    expect(result.street).toBe("Street 54");
    expect(result.number).toBe("66");
    expect(result.complement).toBe("any_complement");
    expect(result.city).toBe("Miami");
    expect(result.state).toBe("Florida");
    expect(result.zipCode).toBe("5453344");
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[1].id).toBe("2");
    expect(result.total).toBe(80);
  });
});
