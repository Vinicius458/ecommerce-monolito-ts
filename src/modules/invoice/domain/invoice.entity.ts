import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItems[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;

  private _address: Address;
  private _items: InvoiceItems[];

  private _total: number = 0;

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
  }

  sum(): void {
    this._total = this._items.reduce((acc, item) => acc + item.price, 0);
  }
  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get total(): number {
    return this._total;
  }

  get items(): Array<InvoiceItems> {
    return this._items;
  }

  get address(): Address {
    return this._address;
  }
}
