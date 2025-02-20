import { IUseCase } from '../../contracts/iusecase';
import { IRepositoryFind } from '../../contracts/irepository';
import { ICurso } from '../../domain/entities/ICurso';
// Definindo a entrada e saída do caso de uso
export interface ConsultaGradeCurricularEntrada {
    cursoId: number;
}

export interface ConsultaGradeCurricularSaida {
    cursoId: number;
    nomeCurso: string;
    disciplinas: string[];
}

// Implementação do caso de uso para consultar a grade curricular
export class ConsultaGradeCurricularUseCase implements IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida> {
    // Simulando um repositório de cursos

    private repo: IRepositoryFind<ICurso>;

    constructor(repo: IRepositoryFind<ICurso>) {
        this.repo = repo;
        console.log('ConsultarCronogramaUseCase instanciado');
    }

    async perform(entrada: ConsultaGradeCurricularEntrada): Promise<ConsultaGradeCurricularSaida> {
        if(entrada.cursoId>50){
            throw new Error('O id do curso não pode ser maior que 50');
        }

        let curso: ICurso | undefined;

        try{
            curso = await this.repo.findById(String(entrada.cursoId));

        } catch (e){
            throw new Error('Erro no repositório');
        }

        if(!curso){
            throw Error ('Curso não encontrado')
        } if(curso.disciplinas.length<5){
            throw new Error('Curso deve ter pelo menos 5 disciplinas');
        } else {
            const saida: ConsultaGradeCurricularSaida = {
                cursoId: curso.cursoId,
                nomeCurso: curso.nomeCurso,
                disciplinas: curso.disciplinas
            };

            return saida;
        }

    }
}