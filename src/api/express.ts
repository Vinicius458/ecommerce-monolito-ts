import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductRoute } from "./routes/product.route";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { ClientRoute } from "./routes/client.route";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceRoute } from "./routes/invoice.route";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import ItemModel from "../modules/invoice/repository/item.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { CheckoutRoute } from "./routes/checkout.route";

export const app: Express = express();
app.use(express.json());
app.use("/product", ProductRoute);
app.use("/client", ClientRoute);
app.use("/invoice", InvoiceRoute);
app.use("/checkout", CheckoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    ProductModel,
    ClientModel,
    InvoiceModel,
    ItemModel,
    OrderModel,
    TransactionModel,
  ]);
  await sequelize.sync();
}
setupDb();
