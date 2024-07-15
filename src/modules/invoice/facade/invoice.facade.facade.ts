import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  GenerateInvoiceFacadeInputDto,
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._generateUseCase = usecasesProps.generateUseCase;
    this._findUseCase = usecasesProps.findUseCase;
  }

  generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    // caso o dto do caso de uso for != do dto da facade, converter o dto da facade para o dto do caso de uso
    return this._generateUseCase.execute(input);
  }
  findInvoice(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return this._findUseCase.execute(input);
  }
}
