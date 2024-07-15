import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import ItemModel from "./item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(input: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        items: input.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: input.total,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      },
      {
        include: [{ model: ItemModel }],
      }
    );
  }
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findByPk(id, {
      include: [{ model: ItemModel }],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    const invoiceEntity = new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.items.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      document: invoice.document,
    });

    invoiceEntity.sum();
    return invoiceEntity;
  }
}
