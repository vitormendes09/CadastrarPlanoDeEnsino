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

// Implementação do caso de uso para consultar a grade curricular
export class ConsultaGradeCurricularUseCase implements IUseCase<ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida> {
    // Simulando um repositório de cursos
    private cursos = [
        {
            cursoId: '1',
            nomeCurso: 'Bacharelado de Sistemas de Informação',
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

        // Regra de negócio: Verificar se o curso está ativo
        const cursoAtivo = this.verificarCursoAtivo(curso.cursoId);
        if (!cursoAtivo) {
            throw new Error('Curso inativo');
        }

        // Regra de negócio: Verificar se o curso tem disciplinas cadastradas
        if (curso.disciplinas.length === 0) {
            throw new Error('Curso sem disciplinas cadastradas');
        }

        // Regra de negócio: Verificar se o curso tem pelo menos uma disciplina obrigatória
        const temDisciplinaObrigatoria = this.verificarDisciplinaObrigatoria(curso.disciplinas);
        if (!temDisciplinaObrigatoria) {
            throw new Error('Curso sem disciplinas obrigatórias');
        }

        // Regra de negócio: Verificar se o curso tem um nome válido
        if (!curso.nomeCurso || curso.nomeCurso.trim().length === 0) {
            throw new Error('Curso com nome inválido');
        }

        // Regra de negócio: Retornar a grade curricular do curso
        return {
            cursoId: curso.cursoId,
            nomeCurso: curso.nomeCurso,
            disciplinas: curso.disciplinas
        };
    }

    // Método para verificar se o curso está ativo (simulação)
    private verificarCursoAtivo(cursoId: string): boolean {
        // Simulação: Todos os cursos com ID ímpar estão ativos
        return parseInt(cursoId) % 2 !== 0;
    }

    // Método para verificar se o curso tem pelo menos uma disciplina obrigatória (simulação)
    private verificarDisciplinaObrigatoria(disciplinas: string[]): boolean {
        // Simulação: Considera que "Algoritmos" é uma disciplina obrigatória
        return disciplinas.includes('Algoritmos');
    }
}