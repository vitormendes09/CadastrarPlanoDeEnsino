import { ConsultaGradeCurricularUseCase, ConsultaGradeCurricularEntrada, ConsultaGradeCurricularSaida } from "../../src/domain/usecases/usecase";

describe('ConsultaGradeCurricularUseCase', () => {
    let useCase: ConsultaGradeCurricularUseCase;

    beforeEach(() => {
        useCase = new ConsultaGradeCurricularUseCase();
    });

    it('deve retornar a grade curricular do curso com sucesso', async () => {
        const entrada: ConsultaGradeCurricularEntrada = { cursoId: '1' };
        const saida: ConsultaGradeCurricularSaida = await useCase.perform(entrada);

        expect(saida).toEqual({
            cursoId: '1',
            nomeCurso: 'Bacharelado de Sistemas de Informação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
        });
    });

    it('deve lançar erro quando o curso não for encontrado', async () => {
        const entrada: ConsultaGradeCurricularEntrada = { cursoId: '999' };

        await expect(useCase.perform(entrada)).rejects.toThrow('Curso não encontrado');
    });

    // Comentando o teste de curso inativo, pois a funcionalidade foi removida
    // it('deve lançar erro quando o curso estiver inativo', async () => {
    //     const entrada: ConsultaGradeCurricularEntrada = { cursoId: '2' };

    //     await expect(useCase.perform(entrada)).rejects.toThrow('Curso inativo');
    // });

    it('deve lançar erro quando o curso não tiver disciplinas cadastradas', async () => {
        useCase['cursos'].push({
            cursoId: '3',
            nomeCurso: 'Curso Sem Disciplinas',
            disciplinas: []
        });
        const entrada: ConsultaGradeCurricularEntrada = { cursoId: '3' };

        await expect(useCase.perform(entrada)).rejects.toThrow('Curso sem disciplinas cadastradas');
    });

    it('deve lançar erro quando o curso não tiver disciplinas obrigatórias', async () => {
        useCase['cursos'].push({
            cursoId: '4',
            nomeCurso: 'Curso Sem Disciplinas Obrigatórias',
            disciplinas: ['Estruturas de Dados', 'Banco de Dados']
        });
        const entrada: ConsultaGradeCurricularEntrada = { cursoId: '4' };

        await expect(useCase.perform(entrada)).rejects.toThrow('Curso sem disciplinas obrigatórias');
    });

    it('deve lançar erro quando o curso tiver nome inválido', async () => {
        useCase['cursos'].push({
            cursoId: '5',
            nomeCurso: '',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados']
        });
        const entrada: ConsultaGradeCurricularEntrada = { cursoId: '5' };

        await expect(useCase.perform(entrada)).rejects.toThrow('Curso com nome inválido');
    });

    it('deve verificar se o curso tem disciplinas obrigatórias corretamente', () => {
        expect(useCase['verificarDisciplinaObrigatoria'](['Algoritmos', 'Estruturas de Dados'])).toBe(true);
        expect(useCase['verificarDisciplinaObrigatoria'](['Estruturas de Dados', 'Banco de Dados'])).toBe(false);
    });
});