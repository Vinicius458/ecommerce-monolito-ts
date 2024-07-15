import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ItemModel from "./item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare complement: string;

  @Column({ allowNull: false })
  declare zipCode: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @HasMany(() => ItemModel)
  declare items: ItemModel[];

  @Column({ allowNull: false })
  declare total: number;
}
