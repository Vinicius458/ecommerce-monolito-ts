import express, { Request, Response } from "express";
import GenerateInvoiceUseCase from "../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";

export const InvoiceRoute = express.Router();

InvoiceRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new GenerateInvoiceUseCase(new InvoiceRepository());
  try {
    const invoiceDto = {
      name: req.body.name,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      items: req.body.items,
    };
    const output = await usecase.execute(invoiceDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
