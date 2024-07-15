import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "item",
  timestamps: false,
})
export default class ItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  declare invoice_id: string;

  @BelongsTo(() => InvoiceModel)
  declare invoice: InvoiceModel;

  @Column({ allowNull: false })
  price: number;
}
