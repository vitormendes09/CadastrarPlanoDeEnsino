import { IUseCase } from '../../contracts/iusecase';

// Definindo a entrada e saída do caso de uso
export interface ConsultaGradeCurricularEntrada {
    cursoId: string;
}

export interface ConsultaGradeCurricularSaida {
    cursoId: string;
    nomeCurso: string;
    disciplinas: string[];
}


export class ConsultaGradeCurricularUseCase implements IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida> {

    // Simulando um repositório de cursos
    private cursos = [
        {
            cursoId: '1',
            nomeCurso: 'Bacharelado de Sistemas da INformação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
        },
        {
            cursoId: '2',
            nomeCurso: 'Ciência da Computação',
            disciplinas: ['Cálculo', 'Programação', 'Inteligência Artificial']
        }
    ];

   
    async perform(entrada: ConsultaGradeCurricularEntrada): Promise<ConsultaGradeCurricularSaida> {

        // Regra de negócio: Verificar se o curso existe

        const curso = this.cursos.find(curso => curso.cursoId === entrada.cursoId);
        if (!curso) {
            throw new Error('Curso não encontrado');
        }

        // Regra de negócio: Retornar a grade curricular do curso

        return {
            cursoId: curso.cursoId,
            nomeCurso: curso.nomeCurso,
            disciplinas: curso.disciplinas
        };
    }
}