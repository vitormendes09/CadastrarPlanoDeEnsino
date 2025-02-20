import { ConsultaGradeCurricularController } from "../../controllers/controller";
import { ConsultaGradeCurricularUseCase } from "../../domain/usecases/usecase";
import { ConsultarCursoRepostory } from "../../data/repositories/consultarcursorepository";
import { BancoDeDados } from "../../data/dataBase/bancodedados";

export function factoryConsultaGradeCurricularController() {
    const repository = new ConsultarCursoRepostory( new BancoDeDados);
    const useCase = new ConsultaGradeCurricularUseCase(repository);
    return new ConsultaGradeCurricularController(useCase);
}