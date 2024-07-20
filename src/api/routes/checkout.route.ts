import express, { Request, Response } from "express";
import PlaceOrderUseCase from "../../modules/checkout/usecase/place-order/place-order.usecase";
import InvoiceFacadeFactory from "../../modules/invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../modules/payment/factory/payment.facade.factory";
import StoreCatalogFacadeFactory from "../../modules/store-catalog/factory/facade.factory";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import { OrderRepository } from "../../modules/checkout/repository/order.repository";

export const CheckoutRoute = express.Router();

CheckoutRoute.post("/", async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const catalogFacade = StoreCatalogFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();
  const repository = new OrderRepository();

  const client = await clientFacade.find({ id: "1" });
  const usecase = new PlaceOrderUseCase(
    clientFacade,
    productFacade,
    catalogFacade,
    repository,
    invoiceFacade,
    paymentFacade
  );

  try {
    const placeOrderDto = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    const output = await usecase.execute(placeOrderDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
