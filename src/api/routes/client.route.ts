import express, { Request, Response } from "express";
import AddClientUseCase from "../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../modules/client-adm/repository/client.repository";
import Address from "../../modules/@shared/domain/value-object/address";

export const ClientRoute = express.Router();

ClientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());
  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,

      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    };
    const output = await usecase.execute(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
