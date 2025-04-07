import { IBancoDeDados } from "../../src/data/dataBase/bancodedados"

import { ConsultarCursoRepostory } from "../../src/data/repositories/consultarcursorepository"

import { ICurso } from "../../src/domain/entities/ICurso"

class FakeBancoDeDados implements IBancoDeDados<ICurso> {
    private opcao: string;
    constructor(opcao: string) {
        this.opcao = opcao
    }


    query(sql: string, param: any): ICurso[] | null {
        if (this.opcao == '1') {
            return [{
                cursoId: 1,
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
            },
            {
                cursoId: 2,
                nomeCurso: 'Ciência da Computação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
            }];
        } else if (this.opcao == '2') {
            return [{
                cursoId: 1,
                nomeCurso: 'Bacharelado de Sistemas de Informação',
                disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
            }];
        } else if (this.opcao == '3') {
            return null;
        } else if (this.opcao == '4') {
            return [];
        } else {
            throw new Error("Erro banco de dados")
        }
    }

}

function makeSUT(opcao: string) {
    const bd = new FakeBancoDeDados(opcao);
    const repo = new ConsultarCursoRepostory(bd);

    return { bd, repo };
}

describe('ConsultarCursoRepository', () => {
    it('deve instanciar ConsultarCronogramaRepository', () => {
        let { bd, repo } = makeSUT('1');
        expect(repo).toBeDefined();
    });
    it('deve chamar o findAll', async () => {
        let { bd, repo } = makeSUT('1');
        let saida = await repo.BuscarTodos();
        expect(saida).toEqual([{
            cursoId: 1,
            nomeCurso: 'Bacharelado de Sistemas de Informação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
        },
        {
            cursoId: 2,
            nomeCurso: 'Ciência da Computação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
        }]);
    });

    it('deve chamar o findById', async () => {
        let { bd, repo } = makeSUT('2');
        let saida = await repo.BuscarPorId("teste");
        expect(saida).toEqual({
            cursoId: 1,
            nomeCurso: 'Bacharelado de Sistemas de Informação',
            disciplinas: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software', 'Redes de Computadores']
        });
    });

    it('deve chamar o findAll e receber undefined', async () => {
        let { bd, repo } = makeSUT('3');
        let saida = await repo.BuscarTodos();
        expect(saida).toEqual([]);
    });

    it('deve chamar o findById e receber undefined', async () => {
        let { bd, repo } = makeSUT('3');
        let saida = await repo.BuscarPorId("teste");
        expect(saida).toEqual(undefined);
    });

    it('deve chamar o findAll e receber um array vazio', async () => {
        let { bd, repo } = makeSUT('4');
        let saida = await repo.BuscarTodos();
        expect(saida).toEqual([]);
    });

    it('deve chamar o findById e receber um array vazio', async () => {
        let { bd, repo } = makeSUT('4');
        let saida = await repo.BuscarPorId("teste");
        expect(saida).toEqual(undefined);
    });

    it('deve chamar o findAll e receber um erro', async () => {
        let { bd, repo } = makeSUT('5');
        let saida = await repo.BuscarTodos();
        expect(saida).toEqual([]);
    });

    it('deve chamar o findById e receber um erro', async () => {
        let { bd, repo } = makeSUT('5');
        let saida = await repo.BuscarPorId("teste");
        expect(saida).toEqual(undefined);
    });
    

})