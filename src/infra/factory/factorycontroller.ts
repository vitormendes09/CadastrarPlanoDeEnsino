import { ConsultaGradeCurricularController } from "../../controllers/controller";
import { ConsultaGradeCurricularUseCase } from "../../domain/usecases/usecase";

export function factoryConsultaGradeCurricularController() {
    const uc = new ConsultaGradeCurricularUseCase();
    const contr = new ConsultaGradeCurricularController(uc);
    return contr;
}